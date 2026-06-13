# 🌱 Database Seeding

This directory contains the CinePass database seeding system. It populates MongoDB with realistic demo data so you can develop and test the platform without manually creating records.

## 📁 Structure

```
seeds/
├── data/
│   ├── users.data.js      # Admin + demo user accounts
│   ├── movies.data.js     # 10 realistic movies
│   └── theaters.data.js   # 5 theaters across Indian cities
├── seed.js                # Main seeder (clears + inserts all data)
├── destroy.js             # Wipes all collections
└── README.md
```

## 🚀 Usage

Run from the `backend/` directory. Ensure your `.env` is configured with a valid `MONGODB_URI` first.

```bash
# Seed the database (clears existing data, then inserts fresh data)
npm run seed

# Destroy all data (clean reset, no re-insert)
npm run seed:destroy
```

## 📊 What Gets Seeded

| Entity | Count | Notes |
|---|---|---|
| **Users** | 2 | 1 admin + 1 regular user (passwords hashed via model hook) |
| **Movies** | 10 | Mix of English, Hindi, Telugu, Tamil films with posters & cast |
| **Theaters** | 5 | Across Mumbai, Bangalore, Delhi, Hyderabad, Chennai |
| **Shows** | ~80+ | Each movie runs in 2 theaters, 2 shows/day, over the next 5 days |

### Show Generation Logic

- Each movie is assigned to **2 theaters** for variety.
- Each theater runs **2 shows per day** for the next **5 days**.
- `availableSeats` is initialized to the theater's `totalSeats` (rows × columns).
- Show times rotate through `10:00`, `13:30`, `17:00`, `20:30`.
- Prices rotate through tiers: ₹180, ₹220, ₹250, ₹300.

## 🔑 Demo Credentials

After seeding, log in with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@cinepass.com` | `admin123` |
| User | `user@cinepass.com` | `user123` |

## ⚠️ Warning

`npm run seed` **deletes all existing data** (users, movies, theaters, shows, and bookings) before inserting fresh records. Do not run against a production database.
