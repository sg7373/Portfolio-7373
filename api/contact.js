export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validations
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // LOGIC: For now, we will log it. 
        // To save permanently, you would connect to a database like MongoDB here.
        console.log('New Message Received:', { name, email, subject, message });

        return res.status(200).json({ success: true, message: 'Message received by backend!' });
    } catch (error) {
        console.error('Backend error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
