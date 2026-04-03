package com.garageos.backend.controller;

import com.garageos.backend.model.FuelPrice;
import com.garageos.backend.repository.FuelPriceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fuel-prices")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class FuelPriceController {

    private final FuelPriceRepository repo;

    public FuelPriceController(FuelPriceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<FuelPrice> getAll() {
        return repo.findAll();
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrent() {
        FuelPrice diesel = repo.findByFuelTypeAndEffectiveToIsNull("DIESEL").orElse(null);
        FuelPrice petrol = repo.findByFuelTypeAndEffectiveToIsNull("PETROL").orElse(null);
        return ResponseEntity.ok(Map.of(
            "diesel", diesel != null ? diesel.getPricePerLiter() : 0,
            "petrol", petrol != null ? petrol.getPricePerLiter() : 0,
            "dieselFrom", diesel != null ? diesel.getEffectiveFrom().toString() : "",
            "petrolFrom", petrol != null ? petrol.getEffectiveFrom().toString() : ""
        ));
    }

    @GetMapping("/on-date")
    public ResponseEntity<?> getOnDate(@RequestParam String date, @RequestParam String fuelType) {
        LocalDate d = LocalDate.parse(date);
        Optional<FuelPrice> price = repo
            .findByFuelTypeAndEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(fuelType, d, d);
        if (price.isEmpty()) {
            price = repo.findByFuelTypeAndEffectiveFromLessThanEqualAndEffectiveToIsNull(fuelType, d);
        }
        return ResponseEntity.ok(price.map(p -> Map.of("price", p.getPricePerLiter()))
            .orElse(Map.of("price", 0)));
    }

    @PostMapping
    public ResponseEntity<?> setPrice(@RequestBody Map<String, Object> body) {
        String fuelType = (String) body.get("fuelType");
        Integer price = (Integer) body.get("pricePerLiter");
        String fromStr = (String) body.get("effectiveFrom");
        LocalDate effectiveFrom = fromStr != null ? LocalDate.parse(fromStr) : LocalDate.now();

        repo.findByFuelTypeAndEffectiveToIsNull(fuelType).ifPresent(current -> {
            current.setEffectiveTo(effectiveFrom.minusDays(1));
            repo.save(current);
        });

        FuelPrice newPrice = new FuelPrice(fuelType, price, effectiveFrom, null);
        return ResponseEntity.ok(repo.save(newPrice));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        List<FuelPrice> diesel = repo.findByFuelTypeOrderByEffectiveFromDesc("DIESEL");
        List<FuelPrice> petrol = repo.findByFuelTypeOrderByEffectiveFromDesc("PETROL");
        return ResponseEntity.ok(Map.of("diesel", diesel, "petrol", petrol));
    }
}