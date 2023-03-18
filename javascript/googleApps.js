
function postRDStation(customerData) {
    // ---------------------- STEP 1 - CRIA CONTATO PAGA PEGAR UUID -----------------//
    var access_token = "your_access_token";
    var headers = {
    "Authorization" : "Bearer "+access_token, 
    "Content-Type": "application/json"    
    }
    var data={
        "entity_type": "CONTACT",
        "event_type": "WEBHOOK.CONVERTED",
        "url": "http://www.setyou.com.br",
        "http_method": "POST",
        "include_relations": ["CONTACT_FUNNEL"]
    }
    var requestOptions = {
    method: 'POST',
    headers: headers,
    payload: Utilities.jsonStringify(data)
    };
    var response = UrlFetchApp.fetch("https://api.rd.services/integrations/webhooks", requestOptions).getContentText();
    var uuid=JSON.parse(response)['uuid'];

    // ---------------------- STEP 2 - POPULA UUID COM DADOS DO CONTATO -----------------//
    var payload=JSON.stringify({
        "name": customerData.name,
        "bio": customerData.bio,
        "personal_phone": customerData.phone,
        "country": customerData.country,
        "tags": customerData.tags,
        "cf_id": customerData.id,
        "cf_uuid": uuid,
        "legal_bases": 
        [{
            "category": "communications",
            "type": "consent",
            "status": "granted"
        }]
    })
    var requestOptions = {
    method: 'PATCH',
    headers: headers,
    payload: payload
    };

    UrlFetchApp.fetch(`https://api.rd.services/platform/contacts/email:${customerData.email}`, requestOptions).getContentText();

    // ---------------------- STEP 3 - REGISTRA COMO CLIENTE NO FUNIL -----------------//
    var payload=Utilities.jsonStringify({
    "lifecycle_stage": "Client",
    "opportunity": true,
    "contact_owner_email": "contact_owner_email@email.com"
    })

    var requestOptions = {
    method: 'PUT',
    headers: headers,
    payload: payload
    };

    UrlFetchApp.fetch("https://api.rd.services/platform/contacts/email:"+variables[18]+"/funnels/default", requestOptions).getContentText();

    // ---------------------- STEP 4 - REGISTRA EVENTO DO CLIENTE -----------------//
    var payment_amount = customerData.payment_amount.toFixed(2);
    var payload = JSON.stringify({
        "event_type": "SALE",
        "event_family":"CDP",
        "payload": {
        "email": customerData.email,
        "funnel_name": "default",
        "value": payment_amount
        }
    })
    var requestOptions = {
    method: 'POST',
    headers: headers,
    payload: payload
    };
    UrlFetchApp.fetch("https://api.rd.services/platform/events", requestOptions).getContentText();
}