import sharp from 'sharp';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const quality = parseInt(req.query.quality) || 90;

    const jpeg = await sharp(buffer)
      .jpeg({ quality: Math.min(100, Math.max(1, quality)) })
      .toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.jpg"');
    res.send(jpeg);
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'Conversion failed. File may not be a valid HEIC image.' });
  }
}
