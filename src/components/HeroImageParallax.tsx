import styles from "../styles/parallax.module.scss";

const HeroImageParallax = () => {
  return (
    <div className={styles.parallax}>
      <img
        alt="Brewlabs token image"
        src="./images/brewlabs-hero-coin-2.png"
        className={`${styles.parallax_coin_2} z-20 ml-52 mt-52 h-auto w-12 sm:ml-[29rem] sm:w-24`}
      />

      <img
        alt="Brewlabs token image"
        src="./images/brewlabs-hero-coin-1.png"
        className={`${styles.parallax_coin_1} z-20 ml-12 mt-48 h-auto w-12 sm:w-24`}
      />

      <img
        alt="Brewlabs token image"
        src="./images/brewlabs-hero-coin-2.png"
        className={`${styles.parallax_coin_3} ml-36 mt-12 h-auto w-12 sm:ml-52 sm:mt-[29rem] sm:w-24`}
      />

      <img
        src="./images/brewlabs-hero-phones.png"
        alt="Brewlabs Swap interface"
        className={`${styles.parallax_phones} z-10 h-auto w-96 sm:w-auto`}
      />

      <img
        src="./images/brewlabs-hero-backlight.png"
        alt="Brewlabs hero back light"
        className={`${styles.parallax_bg} mx-auto w-96 sm:w-auto`}
      />
    </div>
  );
};

export default HeroImageParallax;
