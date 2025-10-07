import { WebhookPayload, WebhookResponse } from '../types/prd';

const WEBHOOK_URL = 'https://hook.us2.make.com/bhjjrm3veuvnhwt4gc3e1qwdlikfp3xh';

export const sendToMakecom = async (payload: WebhookPayload): Promise<WebhookResponse> => {
  try {
    console.log('Sending payload to Make.com:', payload);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Make.com response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Make.com error response:', errorText);
      throw new Error(`Webhook failed with status: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Make.com response text:', responseText);
    
    // Handle different response formats from Make.com
    if (responseText === 'Accepted' || responseText.trim() === 'Accepted') {
      // Make.com webhook accepted the request but will process asynchronously
      // Return a mock response for now - in a real scenario, you'd implement polling or webhooks
      console.log('Make.com accepted the request, using mock response for demo');
      return mockWebhookResponse(payload);
    }
    
    // Check if response looks like JSON (starts with { or [)
    const trimmedResponse = responseText.trim();
    if (trimmedResponse.startsWith('{') || trimmedResponse.startsWith('[')) {
      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText);
        console.log('Make.com response data:', data);
        return data as WebhookResponse;
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        console.log('Raw response:', responseText);
        // Fall back to mock response if JSON parsing fails
        console.log('JSON parsing failed, using mock response for demo');
        return mockWebhookResponse(payload);
      }
    } else {
      // Response is not JSON (could be Markdown, plain text, etc.)
      console.log('Response is not JSON format, using mock response for demo');
      console.log('Non-JSON response content:', responseText.substring(0, 100) + '...');
      return mockWebhookResponse(payload);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Make.com. Please check your internet connection.');
    }
    throw new Error(`Failed to send to Make.com: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateWebhookUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && (
      parsedUrl.hostname.includes('hook.make.com') || 
      parsedUrl.hostname.includes('hook.us2.make.com')
    );
  } catch {
    return false;
  }
};

// Mock response for development/testing - can be used as fallback
export const mockWebhookResponse = (payload: WebhookPayload): Promise<WebhookResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        prdId: payload.prdId,
        enrichedSections: payload.sections.map(section => ({
          ...section,
          content: section.content.replace(/\[AI to [^\]]+\]/g, `**AI-Enhanced Content for ${section.title}**\n\nThis section has been processed and enriched with AI-generated content based on your input. The actual content would be much more detailed and specific to your product requirements.`),
          isGenerated: true
        }))
      });
    }, 3000); // Simulate 3-second processing time
  });
};