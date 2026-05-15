import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable." });
    }

    req.user = sanitizeUser(user);
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé." });
    }
    next();
  };
}

app.get("/", (req, res) => {
  res.json({ message: "Le Backend ChronoDZ est 100% opérationnel ! 🚀" });
});

// ==========================================
// AUTH
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, city, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const safeRole = role === "seller" ? "seller" : "buyer";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        city: city || null,
        role: safeRole,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Compte créé avec succès",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// USERS / PROFILE
// ==========================================

app.get("/api/users", authMiddleware, requireRoles("admin"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

app.put("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Modification non autorisée." });
    }

    const { firstName, lastName, email, phone, city, avatar, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }
    }

    const dataToUpdate = {
      firstName: firstName ?? existingUser.firstName,
      lastName: lastName ?? existingUser.lastName,
      email: email ?? existingUser.email,
      phone: phone ?? existingUser.phone,
      city: city ?? existingUser.city,
      avatar: avatar ?? existingUser.avatar,
    };

    if (password && password.trim().length > 0) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      message: "Profil mis à jour avec succès",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Erreur update user:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
});

// ==========================================
// ORDERS
// ==========================================

app.post("/api/orders", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let connectedUserId = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        connectedUserId = decoded.userId;
      } catch {
        connectedUserId = null;
      }
    }

    const {
      total,
      subtotal,
      shippingFee,
      customerData,
      items,
      paymentLabel,
      shippingLabel,
    } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        total,
        subtotal,
        shippingFee,
        customerData,
        items,
        paymentLabel,
        shippingLabel,
        userId: connectedUserId,
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Erreur création commande:", error);
    res.status(500).json({ error: "Erreur lors de la création de la commande" });
  }
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
  }
});

app.put("/api/orders/:id", authMiddleware, requireRoles("admin", "seller"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Erreur update commande:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la commande" });
  }
});

// ==========================================
// PRODUCTS
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Erreur produits:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des produits" });
  }
});

app.post("/api/products", authMiddleware, requireRoles("seller", "admin"), async (req, res) => {
  try {
    const newProduct = await prisma.product.create({
      data: {
        ...req.body,
        sellerId: req.user.id,
      },
      include: {
        seller: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erreur création produit:", error);
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
});

app.put("/api/products/:id", authMiddleware, requireRoles("seller", "admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    if (req.user.role !== "admin" && product.sellerId !== req.user.id) {
      return res.status(403).json({ error: "Modification non autorisée." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Erreur update produit:", error);
    res.status(500).json({ error: "Erreur lors de la modification du produit" });
  }
});

app.delete("/api/products/:id", authMiddleware, requireRoles("seller", "admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    if (req.user.role !== "admin" && product.sellerId !== req.user.id) {
      return res.status(403).json({ error: "Suppression non autorisée." });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// ==========================================
// FAVORITES
// ==========================================

app.get("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(favorites);
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
  }
});

app.post("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId manquant." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Erreur ajout favori:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout aux favoris" });
  }
});

app.delete("/api/favorites/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: "Favori introuvable." });
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    res.json({ message: "Favori supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression favori:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du favori" });
  }
});

// ==========================================
// SEED
// ==========================================

app.get("/api/seed", async (req, res) => {
  try {
    let seller = await prisma.user.findFirst({
      where: { role: "seller" },
    });

    if (!seller) {
      const hashedPassword = await bcrypt.hash("dealer123", 10);
      seller = await prisma.user.create({
        data: {
          firstName: "Yacine",
          lastName: "Timepieces",
          email: "dealer@chronodz.dz",
          password: hashedPassword,
          phone: "0661 22 33 44",
          city: "Alger",
          role: "seller",
        },
      });
    }

    const existingProducts = await prisma.product.count();

    if (existingProducts === 0) {
      await prisma.product.createMany({
        data: [
          {
            brand: "Rolex",
            model: "Submariner Date",
            ref: "126610LN",
            price: 2150000,
            year: 2022,
            condition: "Très bon état",
            category: "Plongée",
            sellerType: "dealer",
            location: "Alger",
            image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
            description: "Lunette céramique noire, bracelet Oyster acier. Révisée en 2023.",
            buyerProtection: true,
            verified: true,
            stock: 1,
            sellerId: seller.id,
          },
          {
            brand: "Omega",
            model: "Speedmaster Moonwatch",
            ref: "310.30.42.50.01.001",
            price: 1280000,
            year: 2021,
            condition: "Excellent état",
            category: "Chronographe",
            sellerType: "dealer",
            location: "Oran",
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
            description: "Mouvement manuel Calibre 3861, bracelet acier. Full set inclus.",
            buyerProtection: true,
            verified: true,
            stock: 2,
            sellerId: seller.id,
          },
          {
            brand: "Tissot",
            model: "PRX Powermatic 80",
            ref: "T137.407.11.041.00",
            price: 235000,
            year: 2024,
            condition: "Neuf",
            category: "Sport chic",
            sellerType: "dealer",
            location: "Constantine",
            image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?q=80&w=1200&auto=format&fit=crop",
            description: "Cadran bleu, boîtier intégré, réserve de marche 80 heures.",
            buyerProtection: false,
            verified: false,
            stock: 1,
            sellerId: seller.id,
          },
        ],
      });
    }

    res.json({
      message: "Base de données remplie avec succès ! Retourne sur le site React.",
    });
  } catch (error) {
    console.error("Erreur seed:", error);
    res.status(500).json({ error: "Erreur lors du remplissage de la base de données" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur Backend démarré sur http://localhost:${PORT}`);
});