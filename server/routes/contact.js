import { Router } from 'express'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { createLead, listLeads, updateLeadStatus } from '../storage/leadsStore.js'
import { notifyLeadStatusChanged, notifyNewLead } from '../services/notifications.js'

const router = Router()

const VALID_STATUSES = new Set(['new', 'contacted', 'closed'])

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0

const validateLeadBody = (body) => {
  const errors = []

  if (!isNonEmptyString(body.name) || body.name.trim().length < 3) {
    errors.push('name must have at least 3 characters')
  }

  if (!isNonEmptyString(body.phone) || body.phone.replace(/\D/g, '').length < 7) {
    errors.push('phone must be a valid phone number')
  }

  if (!isNonEmptyString(body.subject)) {
    errors.push('subject is required')
  }

  if (!isNonEmptyString(body.message) || body.message.trim().length < 10) {
    errors.push('message must have at least 10 characters')
  }

  if (body.privacy !== true) {
    errors.push('privacy consent is required')
  }

  return errors
}

router.post('/leads', async (req, res) => {
  const errors = validateLeadBody(req.body ?? {})

  if (errors.length) {
    return res.status(400).json({ errors })
  }

  const lead = await createLead(req.body)
  await notifyNewLead(lead)
  return res.status(201).json(lead)
})

router.get('/leads', requireAuth, requireAdmin, async (req, res) => {
  const status = req.query?.status ? String(req.query.status).trim() : ''

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be one of new, contacted, closed' })
  }

  return res.json(await listLeads({ status: status || undefined }))
})

router.patch('/leads/:leadId/status', requireAuth, requireAdmin, async (req, res) => {
  const status = String(req.body?.status || '').trim()
  const previousLead = (await listLeads()).find((lead) => lead.id === req.params.leadId) || null

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be one of new, contacted, closed' })
  }

  const updatedLead = await updateLeadStatus(req.params.leadId, status)

  if (!updatedLead) {
    return res.status(404).json({ error: 'Lead no encontrado' })
  }

  await notifyLeadStatusChanged(updatedLead, previousLead?.status)
  return res.json(updatedLead)
})

export default router
