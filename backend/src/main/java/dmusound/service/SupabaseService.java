package dmusound.service;

import dmusound.client.SupabaseClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupabaseService {

    @Autowired
    private SupabaseClient client;

    public String fetchAcr() {
        return client.getData("acr").getBody();
    }
}