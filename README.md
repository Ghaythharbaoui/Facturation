🧾 FactureStock — Logiciel de Facturation & Gestion de Stock
Application ERP légère similaire à Odoo, construite avec Spring Boot, Angular et PostgreSQL.

📋 Table des Matières
Aperçu du Projet
Stack Technique
Architecture
Modules Fonctionnels
Modèle de Base de Données
Diagramme ERD
Structure du Projet
API REST — Endpoints
Installation & Lancement
Variables d'Environnement
Roadmap
🎯 Aperçu du Projet
FactureStock est un ERP complet destiné aux PME pour gérer :

La facturation (devis, factures, avoirs)
La gestion de stock (produits, entrées/sorties, inventaire)
Les clients & fournisseurs
Les rapports & tableaux de bord
🛠️ Stack Technique
Couche	Technologie	Version
Backend	Spring Boot	3.x
Frontend	Angular	17+
Base de données	PostgreSQL	15+
ORM	Spring Data JPA / Hibernate	—
Sécurité	Spring Security + JWT	—
Documentation API	Swagger / OpenAPI 3	—
Conteneurisation	Docker + Docker Compose	—
Build Backend	Maven	3.9+
Build Frontend	Node.js + npm / Angular CLI	Node 20+
🏗️ Architecture
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│                  Angular 17 + TailwindCSS               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST (JSON)
                         │ JWT Auth Header
┌────────────────────────▼────────────────────────────────┐
│               BACKEND — Spring Boot 3.x                 │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │  Controllers │  │   Services    │  │ Repositories│  │
│  │  (REST API)  │→ │ (Logique métier)│→│  (JPA)      │  │
│  └──────────────┘  └───────────────┘  └──────┬──────┘  │
│                                              │          │
└──────────────────────────────────────────────┼──────────┘
                                               │ JDBC
┌──────────────────────────────────────────────▼──────────┐
│                  PostgreSQL 15                          │
│         (Schéma: facturestock_db)                      │
└─────────────────────────────────────────────────────────┘
Pattern architectural : Layered Architecture (N-Tiers)
Controller → Service → Repository → Entity → Database
📦 Modules Fonctionnels
1. 🔐 Authentification & Gestion des Utilisateurs
Inscription / Connexion avec JWT
Rôles : ADMIN, MANAGER, COMMERCIAL, MAGASINIER
Gestion des permissions par rôle
2. 👥 CRM — Clients & Fournisseurs
Fiche client (nom, adresse, SIRET, email, téléphone)
Fiche fournisseur
Historique des transactions
Segmentation (catégories de clients)
3. 🛍️ Catalogue Produits
Création et gestion des produits
Catégories et sous-catégories
Prix d'achat / prix de vente / TVA
Code-barres / référence SKU
Images produits
4. 📦 Gestion de Stock
Stock initial et mouvements (entrées / sorties)
Stock minimum avec alertes automatiques
Multi-entrepôt
Inventaire périodique
Historique des mouvements avec traçabilité
5. 🧾 Facturation
Devis → conversion en Bon de commande → Facture
Numérotation automatique
Calcul automatique (HT, TVA, TTC)
Remises globales et par ligne
Avoirs (notes de crédit)
Export PDF (iText / JasperReports)
Statuts : BROUILLON | VALIDÉE | PAYÉE | ANNULÉE
6. 💳 Paiements
Enregistrement des paiements (virement, espèces, chèque, carte)
Suivi des encaissements
Factures partiellement payées
Relances automatiques
7. 📊 Rapports & Tableau de Bord
Chiffre d'affaires (jour / mois / année)
Top produits vendus
Stock en temps réel
Clients les plus actifs
Export Excel / PDF des rapports
🗄️ Modèle de Base de Données
Tables Principales
-- Utilisateurs
users (id, username, email, password_hash, role, created_at)

-- Clients & Fournisseurs
partners (id, type [CLIENT|FOURNISSEUR], name, email, phone, address, siret, created_at)

-- Catégories produits
categories (id, name, parent_id, description)

-- Produits
products (id, sku, name, description, category_id, purchase_price, 
          sale_price, tva_rate, unit, barcode, image_url, is_active)

-- Stock
stock (id, product_id, warehouse_id, quantity, min_quantity, updated_at)

-- Mouvements de stock
stock_movements (id, product_id, type [IN|OUT|ADJUST], quantity, 
                 reason, reference, user_id, created_at)

-- Entrepôts
warehouses (id, name, address, is_default)

-- Factures / Devis
invoices (id, number, type [DEVIS|FACTURE|AVOIR], status, 
          partner_id, user_id, issue_date, due_date, 
          subtotal_ht, tva_amount, total_ttc, notes, created_at)

-- Lignes de facture
invoice_lines (id, invoice_id, product_id, description, 
               quantity, unit_price, discount_percent, tva_rate, total_ht)

-- Paiements
payments (id, invoice_id, amount, method, payment_date, reference, notes)
📐 Diagramme ERD
erDiagram

    USERS {
        bigint id PK
        varchar username
        varchar email
        varchar password_hash
        varchar role
        boolean is_active
        timestamp created_at
    }

    PARTNERS {
        bigint id PK
        varchar type
        varchar name
        varchar email
        varchar phone
        text address
        varchar siret
        varchar city
        varchar country
        boolean is_active
        timestamp created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name
        bigint parent_id FK
        text description
    }

    PRODUCTS {
        bigint id PK
        varchar sku
        varchar name
        text description
        bigint category_id FK
        decimal purchase_price
        decimal sale_price
        decimal tva_rate
        varchar unit
        varchar barcode
        varchar image_url
        boolean is_active
        timestamp created_at
    }

    WAREHOUSES {
        bigint id PK
        varchar name
        text address
        boolean is_default
    }

    STOCK {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        decimal quantity
        decimal min_quantity
        timestamp updated_at
    }

    STOCK_MOVEMENTS {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        bigint user_id FK
        varchar type
        decimal quantity
        text reason
        varchar reference
        timestamp created_at
    }

    INVOICES {
        bigint id PK
        varchar number
        varchar type
        varchar status
        bigint partner_id FK
        bigint user_id FK
        date issue_date
        date due_date
        decimal subtotal_ht
        decimal tva_amount
        decimal total_ttc
        decimal discount_percent
        text notes
        timestamp created_at
    }

    INVOICE_LINES {
        bigint id PK
        bigint invoice_id FK
        bigint product_id FK
        text description
        decimal quantity
        decimal unit_price
        decimal discount_percent
        decimal tva_rate
        decimal total_ht
    }

    PAYMENTS {
        bigint id PK
        bigint invoice_id FK
        bigint user_id FK
        decimal amount
        varchar method
        date payment_date
        varchar reference
        text notes
        timestamp created_at
    }

    %% Relations
    CATEGORIES ||--o{ CATEGORIES : "parent / enfant"
    CATEGORIES ||--o{ PRODUCTS : "contient"
    PRODUCTS ||--o{ STOCK : "stocké dans"
    WAREHOUSES ||--o{ STOCK : "héberge"
    PRODUCTS ||--o{ STOCK_MOVEMENTS : "concerne"
    WAREHOUSES ||--o{ STOCK_MOVEMENTS : "lieu"
    USERS ||--o{ STOCK_MOVEMENTS : "effectue"
    PARTNERS ||--o{ INVOICES : "destinataire"
    USERS ||--o{ INVOICES : "créée par"
    INVOICES ||--|{ INVOICE_LINES : "contient"
    PRODUCTS ||--o{ INVOICE_LINES : "référencé dans"
    INVOICES ||--o{ PAYMENTS : "réglée par"
    USERS ||--o{ PAYMENTS : "enregistré par"
Légende des Relations
Relation	Cardinalité	Description
CATEGORIES → CATEGORIES	0..N	Auto-référence (catégories imbriquées)
CATEGORIES → PRODUCTS	1..N	Une catégorie contient plusieurs produits
PRODUCTS → STOCK	1..N	Un produit peut être stocké dans plusieurs entrepôts
WAREHOUSES → STOCK	1..N	Un entrepôt contient plusieurs lignes de stock
INVOICES → INVOICE_LINES	1..N	Une facture a au moins une ligne
INVOICES → PAYMENTS	0..N	Une facture peut avoir plusieurs paiements partiels
PARTNERS → INVOICES	0..N	Un client/fournisseur peut avoir plusieurs factures
📁 Structure du Projet
facturestock/
│
├── backend/                          # Spring Boot
│   ├── src/main/java/com/facturestock/
│   │   ├── config/                   # SecurityConfig, SwaggerConfig, JwtConfig
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── InvoiceController.java
│   │   │   ├── StockController.java
│   │   │   └── PartnerController.java
│   │   ├── service/                  # Logique métier
│   │   │   ├── InvoiceService.java
│   │   │   ├── StockService.java
│   │   │   └── ...
│   │   ├── repository/               # Interfaces JPA
│   │   ├── entity/                   # Entités JPA
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── mapper/                   # MapStruct Mappers
│   │   ├── exception/                # Gestion des exceptions
│   │   └── security/                 # JWT Filter, UserDetails
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── application-prod.yml
│   └── pom.xml
│
├── frontend/                         # Angular
│   ├── src/app/
│   │   ├── core/                     # Guards, Interceptors, Services globaux
│   │   │   ├── auth/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── shared/                   # Composants réutilisables
│   │   │   ├── components/
│   │   │   └── pipes/
│   │   ├── features/                 # Modules fonctionnels
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── stock/
│   │   │   ├── invoices/
│   │   │   ├── partners/
│   │   │   └── reports/
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── angular.json
│   └── package.json
│
├── docker-compose.yml                # Orchestration locale
├── docker-compose.prod.yml
└── README.md
🌐 API REST — Endpoints
Authentification
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh-token
Produits
GET    /api/products              # Liste avec pagination & filtres
POST   /api/products              # Créer un produit
GET    /api/products/{id}         # Détail produit
PUT    /api/products/{id}         # Modifier
DELETE /api/products/{id}         # Supprimer (soft delete)
Stock
GET    /api/stock                 # État du stock global
GET    /api/stock/{productId}     # Stock d'un produit
POST   /api/stock/movement        # Créer un mouvement (entrée/sortie)
GET    /api/stock/movements       # Historique des mouvements
GET    /api/stock/alerts          # Produits sous stock minimum
Factures & Devis
GET    /api/invoices              # Liste des factures
POST   /api/invoices              # Créer une facture/devis
GET    /api/invoices/{id}         # Détail
PUT    /api/invoices/{id}         # Modifier (si BROUILLON)
POST   /api/invoices/{id}/validate  # Valider
POST   /api/invoices/{id}/pay    # Enregistrer paiement
GET    /api/invoices/{id}/pdf    # Télécharger PDF
Clients / Fournisseurs
GET    /api/partners              # Liste (filtre: type=CLIENT|FOURNISSEUR)
POST   /api/partners              # Créer
GET    /api/partners/{id}         # Détail + historique
PUT    /api/partners/{id}         # Modifier
Rapports
GET    /api/reports/revenue?from=&to=     # CA sur période
GET    /api/reports/top-products          # Top produits
GET    /api/reports/stock-value           # Valeur du stock
🚀 Installation & Lancement
Prérequis
Java 21+
Node.js 20+
Docker & Docker Compose
PostgreSQL 15 (ou via Docker)
1. Cloner le projet
git clone https://github.com/votre-user/facturestock.git
cd facturestock
2. Lancer avec Docker Compose (recommandé)
docker-compose up -d
Démarre PostgreSQL + Backend + Frontend automatiquement

3. Lancement manuel
Backend

cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
Frontend

cd frontend
npm install
ng serve
URLs d'accès
Service	URL
Frontend	http://localhost:4200
Backend API	http://localhost:8080/api
Swagger UI	http://localhost:8080/swagger-ui
PostgreSQL	localhost:5432
⚙️ Variables d'Environnement
Backend (application-dev.yml)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/facturestock_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key-min-32-chars}
    expiration: 86400000   # 24h en ms
  upload:
    dir: ${UPLOAD_DIR:./uploads}
Docker Compose
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: facturestock_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      JWT_SECRET: super-secret-key-for-jwt-tokens
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  pgdata:
🗺️ Roadmap
Phase 1 — MVP (Mois 1-2)
[x] Authentification JWT
[ ] CRUD Produits & Catégories
[ ] Gestion de stock basique
[ ] Facturation simple (devis → facture)
[ ] Export PDF
Phase 2 — Core Features (Mois 3-4)
[ ] Tableau de bord avec graphiques
[ ] Multi-entrepôt
[ ] Gestion des paiements
[ ] Relances automatiques
[ ] Rôles et permissions avancés
Phase 3 — Avancé (Mois 5-6)
[ ] Rapports avancés & export Excel
[ ] API mobile (React Native / Flutter)
[ ] Notifications (email, alertes stock)
[ ] Intégration comptabilité
[ ] Multi-devise & multi-langue
👥 Contributeurs
Nom	Rôle
Votre Nom	Développeur Full Stack
📄 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.