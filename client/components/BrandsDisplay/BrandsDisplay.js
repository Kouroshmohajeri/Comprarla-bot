import React from "react";
import Image from "next/image";
import styles from "./BrandsDisplay.module.css";

const brands = [
  // Brand objects
  {
    name: "Zara",
    logo: "/brands/Zara_Logo.svg",
    url: "https://www.zara.com/es/en/",
  },
  {
    name: "Bershka",
    logo: "/brands/Bershka_logo.svg",
    url: "https://www.bershka.com/es/",
  },
  {
    name: "Massimo Dutti",
    logo: "/brands/Massimo_Dutti_logo.svg",
    url: "https://www.massimodutti.com/es",
  },
  {
    name: "Oysho",
    logo: "/brands/Logo_oysho.svg",
    url: "https://www.oysho.com/es/en/",
  },
  {
    name: "Stradivarius",
    logo: "/brands/Stradivarius_logo.svg",
    url: "https://www.stradivarius.com/es/",
  },
  {
    name: "Pull&Bear",
    logo: "/brands/Pull&Bear_logo.svg",
    url: "https://www.pullandbear.com/es/",
  },
  {
    name: "Crocs",
    logo: "/brands/Crocs_wordmark.svg",
    url: "https://crocs.es/es/",
  },
  {
    name: "Calvin Klein",
    logo: "/brands/CK_Calvin_Klein_logo.svg",
    url: "https://www.calvinklein.es/",
  },
  {
    name: "Veja",
    logo: "/brands/Veja_(brand).svg",
    url: "https://www.veja-store.com/es_es/",
  },
  {
    name: "Nike",
    logo: "/brands/Logo_NIKE.svg",
    url: "https://www.nike.com/es/",
  },
  {
    name: "Adidas",
    logo: "/brands/Adidas_Logo.svg",
    url: "https://www.adidas.es/",
  },
  {
    name: "Golden Goose",
    logo: "/brands/Goldengoose.png",
    url: "https://www.goldengoose.com/es/",
  },
  {
    name: "Michael Kors",
    logo: "/brands/Michael_Kors_Logo.svg",
    url: "https://www.michaelkors.es/",
  },
  {
    name: "Tommy Hilfiger",
    logo: "/brands/tommy-hilfiger-2.svg",
    url: "https://es.tommy.com/",
  },
  {
    name: "Longchamp",
    logo: "/brands/Longchamp_logo.svg",
    url: "https://www.longchamp.com/es/es/",
  },
  {
    name: "Lululemon",
    logo: "/brands/Lululemon_Athletica_logo.svg",
    url: "https://www.lululemon.es/es-es/home",
  },
  {
    name: "New Balance",
    logo: "/brands/New_Balance_logo.svg",
    url: "https://www.newbalance.es/",
  },
  {
    name: "Birkenstock",
    logo: "/brands/Birkenstock_logo.svg",
    url: "https://www.birkenstock.com/es",
  },
];

const BrandsDisplay = () => {
  // Shuffle brands array for random display
  const shuffledBrands = [...brands].sort(() => Math.random() - 0.5);

  return (
    <div className={styles.brandsGrid}>
      {shuffledBrands.map((brand, index) => (
        <a
          href={brand.url}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          className={styles.brandItem}
        >
          <div className={styles.logoWrapper}>
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={80} // Set the width of the logo
              height={80} // Set the height of the logo
              className={styles.logo}
            />
          </div>
          <span className={styles.brandName}>{brand.name}</span>
        </a>
      ))}
    </div>
  );
};

export default BrandsDisplay;
