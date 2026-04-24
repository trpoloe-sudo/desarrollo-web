import { randomUUID } from "crypto";
import { db } from "./database.js";

const mapLeadRow = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  company: row.company,
  subject: row.subject,
  message: row.message,
  source: row.source,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const listLeads = async ({ status } = {}) => {
  const rows = status
    ? db.prepare(`
        SELECT * FROM leads
        WHERE status = ?
        ORDER BY datetime(created_at) DESC
      `).all(status)
    : db.prepare(`
        SELECT * FROM leads
        ORDER BY datetime(created_at) DESC
      `).all();

  return rows.map(mapLeadRow);
};

export const createLead = async (payload) => {
  const now = new Date().toISOString();
  const lead = {
    id: randomUUID(),
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    company: String(payload.company || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
    source: String(payload.source || "web").trim() || "web",
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO leads (
      id, name, phone, company, subject, message, source, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lead.id,
    lead.name,
    lead.phone,
    lead.company,
    lead.subject,
    lead.message,
    lead.source,
    lead.status,
    lead.createdAt,
    lead.updatedAt
  );

  return lead;
};

export const updateLeadStatus = async (leadId, status) => {
  const existingLead = db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId);

  if (!existingLead) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  db.prepare(`
    UPDATE leads
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).run(status, updatedAt, leadId);

  return mapLeadRow(db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId));
};
