Sem sa budú vkladať reálne fotografie realizácií D&K AutoCARE.

Odporúčané / pripravené názvy súborov (podľa kategórií v sekcii Galéria):

interier-01.jpg      -> Čistenie interiéru
interier-02.jpg      -> Čistenie interiéru (ďalšia fotka)
tepovanie-01.jpg      -> Tepovanie
svetlomety-01.jpg     -> Leštenie svetlometov
diagnostika-01.jpg    -> Diagnostika
radio-01.jpg          -> Android rádio
kamera-01.jpg         -> Cúvacia kamera

AKO PRIDAŤ REÁLNU FOTKU (v index.html, sekcia #galeria):

1. Nahraj fotografiu do tohto priečinka (assets/images/gallery/).
2. V príslušnej .gallery-card nahraď obsah .gallery-media takto:

   <div class="gallery-media">
     <img src="assets/images/gallery/interier-01.jpg"
          alt="Čistenie interiéru - D&K AutoCARE"
          loading="lazy">
   </div>

3. Ponechaj triedu "gallery-media" aj atribút data-category na <figure> -
   lightbox (js/script.js) automaticky rozpozná <img> vo vnútri karty
   a po kliknutí ho zobrazí zväčšené v modálnom okne.
4. Kým karta obsahuje len emoji placeholder (bez <img>), kliknutie na ňu
   nič neurobí - lightbox sa aktivuje sám, akonáhle pribudne reálna fotka.

Odporúčaný formát: .jpg alebo .webp, optimalizované pre web (cca 200-500 KB / fotografiu).
