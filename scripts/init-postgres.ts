import { loadEnvConfig } from "@next/env"
import { initializeDatabase } from "../src/lib/postgres"

loadEnvConfig(process.cwd())
initializeDatabase().then(() => {
  console.log("Neon Postgres initialized. Existing records were preserved; sample customers were not imported.")
}).catch(() => {
  console.error("Database initialization failed. Check DATABASE_URL and the connected Neon project.")
  process.exitCode = 1
})
