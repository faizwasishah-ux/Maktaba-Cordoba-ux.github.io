import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  email: string;
  phone?: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    size?: string;
    quantity: number;
    featherCustomization?: boolean;
  }>;
  total: number;
  date: string;
  estimatedDelivery: string;
  currentStatus: string;
  stepIndex: number;
  shippingAddress: string;
  carrier?: string;
  trackingNumber?: string;
  timeline?: Array<{
    title: string;
    description: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }>;
}

// In-memory persistent order registry with sample couture records
const ORDERS_DB: TrackedOrder[] = [
  {
    orderNumber: "ZS-2026-8941",
    customerName: "Eleanor Vance",
    email: "eleanor.bride@example.com",
    phone: "+1 (555) 948-2194",
    items: [
      {
        id: 1,
        name: "Celeste Feather-Trimmed Silk Organza Gown",
        price: 489.99,
        image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80",
        category: "Bridal Gowns",
        size: "US 4 (S)",
        quantity: 1,
        featherCustomization: true,
      },
      {
        id: 4,
        name: "Aurelia Pearl Embroidered Cathedral Veil",
        price: 189.99,
        image: "https://images.unsplash.com/photo-1546804784-896d0dca3805?w=800&auto=format&fit=crop&q=80",
        category: "Veils & Capes",
        size: "3.5m Cathedral",
        quantity: 1,
        featherCustomization: false,
      },
    ],
    total: 679.98,
    date: "2026-09-15",
    estimatedDelivery: "2026-09-24",
    currentStatus: "Handcrafting & Feather Attachment",
    stepIndex: 1,
    shippingAddress: "742 Evergreen Terrace, Suite 4B, Beverly Hills, CA 90210",
    carrier: "Zarghun Atelier White-Glove Courier & DHL Express",
    trackingNumber: "DHL-ZS-8941-EXP",
    timeline: [
      {
        title: "Bespoke Bridal Pattern Approved",
        description: "Measurements verified by Master Draper Sarah Jenkins",
        location: "Paris Haute Atelier, Rue du Faubourg",
        timestamp: "Sep 15, 2026 - 10:30 AM",
        completed: true,
      },
      {
        title: "Silk Organza Cutting & Hand-Beading",
        description: "Ethical ostrich feather plumes hand-stitched along neckline and train",
        location: "Paris Haute Atelier, Studio 3",
        timestamp: "Sep 16, 2026 - 02:45 PM",
        completed: true,
      },
      {
        title: "Pre-Dispatch Steam Pressing & Keepsake Packaging",
        description: "Bridal garment trunk inspection and acid-free archival wrapping",
        location: "Milano Logistics Hub",
        timestamp: "Sep 18, 2026 - 09:00 AM (Scheduled)",
        completed: false,
      },
      {
        title: "White-Glove Courier Delivery & Fitting",
        description: "Hand delivery to client residence with concierge fitting assistant",
        location: "Beverly Hills, CA",
        timestamp: "Sep 24, 2026 - 11:00 AM (Estimated)",
        completed: false,
      },
    ],
  },
  {
    orderNumber: "ZS-2026-7721",
    customerName: "Faiz Wasi Shah",
    email: "faizwasishah@gmail.com",
    phone: "+92 311 7585046",
    items: [
      {
        id: 201,
        name: "Royal Zardozi Silk Sherwani (Men's Asian Dress)",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
        category: "Asian Couture",
        size: "40 Regular (M)",
        quantity: 1,
        featherCustomization: false,
      },
      {
        id: 204,
        name: "Gulnar Royal Zardozi Asian Bridal Gown",
        price: 529.99,
        image: "/images/bridal_dress_only.jpg",
        category: "Asian Couture",
        size: "US 4 (S)",
        quantity: 1,
        featherCustomization: true,
      },
    ],
    total: 879.98,
    date: "2026-09-12",
    estimatedDelivery: "2026-09-21",
    currentStatus: "Quality Inspection & Beading Verification",
    stepIndex: 2,
    shippingAddress: "88 Royal Crest Boulevard, Penthouse 12, New York, NY 10001",
    carrier: "Insured Diplomatic Couture Courier",
    trackingNumber: "IDC-NYC-7721",
    timeline: [
      {
        title: "Asian Couture Order Verified",
        description: "Gold zardozi bullion embroidery and threadwork audited",
        location: "Lahore Heritage Workshop",
        timestamp: "Sep 12, 2026 - 11:15 AM",
        completed: true,
      },
      {
        title: "Hand-Crafting Completed",
        description: "Tailoring completed for Sherwani and Bridal Gown ensemble",
        location: "Atelier Finishing Department",
        timestamp: "Sep 14, 2026 - 04:20 PM",
        completed: true,
      },
      {
        title: "Quality Inspection & Jewel Attachment",
        description: "Passing 42-point couture seam durability and hemline test",
        location: "New York Bridal Vault",
        timestamp: "Sep 17, 2026 - 09:30 AM",
        completed: true,
      },
      {
        title: "Dispatched for Penthouse Hand-Delivery",
        description: "Driver dispatched with temperature-controlled garment vehicle",
        location: "New York, NY",
        timestamp: "Sep 21, 2026 - 01:00 PM (Scheduled)",
        completed: false,
      },
    ],
  },
  {
    orderNumber: "ZS-2026-4409",
    customerName: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 (555) 728-1192",
    items: [
      {
        id: 202,
        name: "Noor Embellished Silk Anarkali (Women's Asian Dress)",
        price: 389.99,
        image: "/images/asian_dress_only.jpg",
        category: "Asian Couture",
        size: "US 6 (M)",
        quantity: 1,
        featherCustomization: false,
      },
    ],
    total: 389.99,
    date: "2026-09-16",
    estimatedDelivery: "2026-09-28",
    currentStatus: "Order Confirmed",
    stepIndex: 0,
    shippingAddress: "124 Ocean Avenue, Miami, FL 33139",
    carrier: "DHL Express Bridal Worldwide",
    trackingNumber: "DHL-MIA-4409",
    timeline: [
      {
        title: "Order Received & Payment Cleared",
        description: "Payment confirmed via Apple Pay. Dress pattern entered production.",
        location: "Central Atelier Registry",
        timestamp: "Sep 16, 2026 - 03:10 PM",
        completed: true,
      },
    ],
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // -------------------------------------------------------------
  // API: Track Order by orderNumber, email, or query
  // -------------------------------------------------------------
  app.get("/api/orders/track", (req, res) => {
    const code = (req.query.code || req.query.orderNumber || req.query.q || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Missing tracking query parameter. Provide 'code' or 'orderNumber'.",
      });
    }

    // Search by orderNumber, email, phone, or name
    const match = ORDERS_DB.find((o) => {
      return (
        o.orderNumber.toLowerCase() === code ||
        o.orderNumber.toLowerCase().includes(code) ||
        o.email.toLowerCase() === code ||
        (o.phone && o.phone.includes(code)) ||
        o.customerName.toLowerCase().includes(code)
      );
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        error: `No atelier order found matching '${code}'. Please verify your tracking number (e.g., ZS-2026-8941) or email.`,
        availableDemoCodes: ORDERS_DB.map((o) => o.orderNumber),
      });
    }

    return res.json({
      success: true,
      order: match,
      serverTime: new Date().toISOString(),
      apiCarrierService: "Zarghun Studio Global Haute Logistics API v2.4",
      whatsAppDirectInquiry: `https://wa.me/923117585046?text=${encodeURIComponent(
        `Hello Zarghun Studio Concierge, I am inquiring about my Bridal Order #${match.orderNumber} (${match.customerName}). Status: ${match.currentStatus}`
      )}`,
    });
  });

  // Track single order by route param: /api/orders/track/:orderNumber
  app.get("/api/orders/track/:orderNumber", (req, res) => {
    const code = req.params.orderNumber.trim().toLowerCase();
    const match = ORDERS_DB.find(
      (o) => o.orderNumber.toLowerCase() === code || o.orderNumber.toLowerCase().includes(code)
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        error: `Order #${req.params.orderNumber} not found in atelier registry.`,
      });
    }

    return res.json({
      success: true,
      order: match,
      apiCarrierService: "Zarghun Studio Global Haute Logistics API v2.4",
    });
  });

  // -------------------------------------------------------------
  // API: Register / Save new order to database
  // -------------------------------------------------------------
  app.post("/api/orders", (req, res) => {
    try {
      const body = req.body;
      if (!body || !body.customerName || !body.total) {
        return res.status(400).json({ success: false, error: "Invalid order payload" });
      }

      const orderNumber =
        body.orderNumber || `ZS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: TrackedOrder = {
        orderNumber,
        customerName: body.customerName,
        email: body.email || "client@example.com",
        phone: body.phone || "+1 (555) 019-2834",
        items: body.items || [],
        total: body.total,
        date: body.date || new Date().toISOString().split("T")[0],
        estimatedDelivery: body.estimatedDelivery || "2026-09-28",
        currentStatus: body.currentStatus || "Order Confirmed & Atelier Assigned",
        stepIndex: body.stepIndex || 0,
        shippingAddress: body.shippingAddress || "Client Destination",
        carrier: "Zarghun White-Glove Insured Delivery",
        trackingNumber: `EXP-${orderNumber}`,
        timeline: [
          {
            title: "Order Placed & Payment Authorized",
            description: "Garment specifications and sizing locked in atelier production",
            location: "Zarghun Studio Central Booking",
            timestamp: new Date().toLocaleString(),
            completed: true,
          },
        ],
      };

      // Add to front of database
      ORDERS_DB.unshift(newOrder);

      return res.status(201).json({
        success: true,
        message: "Order successfully registered in Zarghun Studio tracking system",
        order: newOrder,
        whatsAppConfirmationUrl: `https://wa.me/923117585046?text=${encodeURIComponent(
          `Hello Zarghun Studio Atelier! 👰✨ I just placed order #${newOrder.orderNumber} for $${newOrder.total.toFixed(
            2
          )}. Please confirm production and measurement review.`
        )}`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // API: WhatsApp Configuration and Link Generator
  // -------------------------------------------------------------
  app.get("/api/whatsapp/config", (req, res) => {
    res.json({
      whatsappNumber: "+92 311 7585046",
      localNumber: "03117585046",
      internationalDial: "+923117585046",
      directUrl: "https://wa.me/923117585046",
      conciergeName: "Faiz Wasi Shah & Atelier Bridal Team",
      workingHours: "24/7 VIP Bridal Concierge",
      quickActions: [
        {
          id: "custom_fitting",
          label: "Book In-Person Fitting",
          text: "Hello Zarghun Studio, I would like to schedule a private bridal gown fitting consultation.",
        },
        {
          id: "feather_custom",
          label: "Inquire Feather Accents",
          text: "Hello, I want to inquire about custom feather trims and veil matching for my wedding gown.",
        },
        {
          id: "asian_couture",
          label: "Asian Couture Set Consultation",
          text: "Hello Zarghun Studio, I would like bespoke bridal styling advice for an Asian wedding ensemble (Men, Women & Children).",
        },
      ],
    });
  });

  // -------------------------------------------------------------
  // Vite middleware for development & static fallback for prod
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
