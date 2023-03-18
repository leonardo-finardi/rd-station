interface ContactData {
    name: string;
    bio: string;
    personal_phone: string;
    country: string;
    tags: string[];
    cf_id: string;
    cf_uuid: string;
    legal_bases: {
      category: string;
      type: string;
      status: string;
    }[];
  }
  
  interface FunnelData {
    lifecycle_stage: string;
    opportunity: boolean;
    contact_owner_email: string;
  }
  
  interface EventData {
    event_type: string;
    event_family: string;
    payload: {
      email: string;
      funnel_name: string;
      value: string;
    };
  }
  
  async function createContact(access_token: string, data: any): Promise<string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };
    const response = await fetch(
      "https://api.rd.services/integrations/webhooks",
      requestOptions
    );
    const uuid = (await response.json()).uuid;
    return uuid;
  }
  
  async function updateContact(access_token: string, uuid: string, payload: ContactData): Promise<void> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    const requestOptions = {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    };
    await fetch(
      `https://api.rd.services/platform/contacts/uuid:${uuid}`,
      requestOptions
    );
  }
  
  async function registerFunnel(access_token: string, email: string, payload: FunnelData): Promise<void> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    const requestOptions = {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    };
    await fetch(
      `https://api.rd.services/platform/contacts/email:${email}/funnels/default`,
      requestOptions
    );
  }
  
  async function registerEvent(access_token: string, payload: EventData): Promise<void> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    };
    await fetch("https://api.rd.services/platform/events", requestOptions);
  }
  