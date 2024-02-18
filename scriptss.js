$(document).ready(function(){
    var produkty = [
        { nazev: "Tužka", cenaZaKus: 10, pocetNaSklade: 100 },
        { nazev: "Sešit", cenaZaKus: 20, pocetNaSklade: 150 },
        { nazev: "Batoh", cenaZaKus: 500, pocetNaSklade: 50 },
        { nazev: "Pravítko", cenaZaKus: 30, pocetNaSklade: 75 },
        { nazev: "Pero", cenaZaKus: 40, pocetNaSklade: 200 },
        { nazev: "Kalkulačka", cenaZaKus: 200, pocetNaSklade: 30 },
        { nazev: "Barvy", cenaZaKus: 150, pocetNaSklade: 80 },
        { nazev: "Štětce", cenaZaKus: 60, pocetNaSklade: 120 },
        { nazev: "Ležidlo", cenaZaKus: 300, pocetNaSklade: 40 },
        { nazev: "Mapa světa", cenaZaKus: 180, pocetNaSklade: 60 }
    ];

    // Funkce pro přidání produktu do tabulky
    function pridejProduktDoTabulky(nazev, cenaZaKus, pocetNaSklade) {
        var radek = "<tr><td>" + nazev + "</td><td class='cena'>" + cenaZaKus + "</td><td class='mnozstvi'>" + pocetNaSklade + "</td><td><button class='btn btn-primary btnUpravitProdukt' data-bs-toggle='modal' data-bs-target='#modalUpravitProdukt'>Upravit</button></td><td><button class='btn btn-danger btnSmazatProdukt'>Smazat</button></td></tr>";
        $("#seznamProduktu").append(radek);
    }

    // Přidání všech produktů do tabulky při načtení stránky
    produkty.forEach(function(produkt) {
        pridejProduktDoTabulky(produkt.nazev, produkt.cenaZaKus, produkt.pocetNaSklade);
    });

    // Funkce pro filtrování a zobrazení produktů v tabulce skladu
    function zobrazFiltrovaneProdukty(searchTerm) {
        // Vyčistit tabulku skladu
        $("#seznamProduktu").empty();
        
        // Projít všechny produkty
        produkty.forEach(function(produkt) {
            // Pokud název produktu obsahuje hledaný termín
            if (produkt.nazev.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Přidat produkt do tabulky skladu
                pridejProduktDoTabulky(produkt.nazev, produkt.cenaZaKus, produkt.pocetNaSklade);
            }
        });
    }

    // Obsluha události změny v poli pro vyhledávání
    $("#searchProduct").on("input", function() {
        var searchTerm = $(this).val();
        zobrazFiltrovaneProdukty(searchTerm);
    });

    // Obsluha události smazání produktu
    $(document).on("click", ".btnSmazatProdukt", function(){
        var index = $(this).closest("tr").index();
        produkty.splice(index, 1);
        $(this).closest("tr").remove();
        aktualizujStatistiky(); // Aktualizovat statistiky po smazání produktu
    });

    // Obsluha události úpravy produktu
    $(document).on("click", ".btnUpravitProdukt", function(){
        var radek = $(this).closest("tr");
        var nazev = radek.find("td:eq(0)").text();
        var cenaZaKus = radek.find("td:eq(1)").text();
        var pocetNaSklade = radek.find("td:eq(2)").text();
        
        $("#editovatelnyNazev").val(nazev);
        $("#editovatelnaCena").val(cenaZaKus);
        $("#editovatelneMnozstvi").val(pocetNaSklade);
        
        $("#modalUpravitProdukt").data("aktivniRadek", radek);
    });

    // Obsluha události uložení úprav produktu
    $("#btnUlozitUpravu").click(function(){
        var novaCena = $("#editovatelnaCena").val();
        var noveMnozstvi = $("#editovatelneMnozstvi").val();

        var radek = $("#modalUpravitProdukt").data("aktivniRadek");
        radek.find("td:eq(1)").text(novaCena);
        radek.find("td:eq(2)").text(noveMnozstvi);

        $('#modalUpravitProdukt').modal('hide');
        aktualizujStatistiky(); // Aktualizovat statistiky po úpravě produktu
    });

    // Obsluha události kliknutí na tlačítko pro zobrazení nejdražšího produktu
    $("#btnNejdrazsiProdukt").click(function() {
        var nejdrazsiProdukt = najdiNejdrasiiProdukt();
        if (nejdrazsiProdukt) {
            alert("Nejdražší produkt: " + nejdrazsiProdukt.nazev + " s cenou " + nejdrazsiProdukt.cenaZaKus + " Kč za kus.");
        } else {
            alert("Žádný produkt nenalezen.");
        }
    });

    // Obsluha události kliknutí na tlačítko pro zobrazení nejlevnějšího produktu
    $("#btnNejlevnejsiProdukt").click(function() {
        var nejlevnejsiProdukt = najdiNejlevnejsiProdukt();
        if (nejlevnejsiProdukt) {
            alert("Nejlevnější produkt: " + nejlevnejsiProdukt.nazev + " s cenou " + nejlevnejsiProdukt.cenaZaKus + " Kč za kus.");
        } else {
            alert("Žádný produkt nenalezen.");
        }
    });

    // Obsluha události kliknutí na tlačítko pro výpočet celkové ceny skladu
    $("#btnCelkovaCenaSkladu").click(function() {
        var celkovaHodnota = vypocetCelkoveHodnoty();
        alert("Celková hodnota zásob na skladě: " + celkovaHodnota + " Kč.");
    });

    // Funkce pro aktualizaci statistik po úpravě nebo smazání produktu
    function aktualizujStatistiky() {
        zobrazStatistiky(); // Znovu zobrazit statistiky
    }

    // Funkce pro zobrazení statistik
    function zobrazStatistiky() {
        let nejdrazsiProdukt = najdiNejdrasiiProdukt();
        let nejlevnejsiProdukt = najdiNejlevnejsiProdukt();
        let celkovaHodnota = vypocetCelkoveHodnoty();

        $("#nejdrazsiProduktText").html("<b>Nejdražší produkt:</b> " + (nejdrazsiProdukt ? nejdrazsiProdukt.nazev + " s cenou " + nejdrazsiProdukt.cenaZaKus + " Kč za kus." : "Neznámý"));
        $("#nejlevnejsiProduktText").html("<b>Nejlevnější produkt:</b> " + (nejlevnejsiProdukt ? nejlevnejsiProdukt.nazev + " s cenou " + nejlevnejsiProdukt.cenaZaKus + " Kč za kus." : "Neznámý"));
        $("#celkovaHodnotaText").html("<b>Celková hodnota</b> zásob: " + celkovaHodnota + " Kč.");
    }

    // Funkce pro nalezení nejdražšího produktu
    function najdiNejdrasiiProdukt() {
        if (produkty.length === 0) return null;
        return produkty.reduce((max, produkt) => (produkt.cenaZaKus > max.cenaZaKus) ? produkt : max);
    }

    // Funkce pro nalezení nejlevnějšího produktu
    function najdiNejlevnejsiProdukt() {
        if (produkty.length === 0) return null;
        return produkty.reduce((min, produkt) => (produkt.cenaZaKus < min.cenaZaKus) ? produkt : min);
    }

    // Funkce pro výpočet celkové hodnoty zásob
    function vypocetCelkoveHodnoty() {
        if (produkty.length === 0) return 0;
        return produkty.reduce((total, produkt) => total + (produkt.cenaZaKus * produkt.pocetNaSklade), 0);
    }

    // Zobrazit statistiky po načtení stránky
    zobrazStatistiky();
});
