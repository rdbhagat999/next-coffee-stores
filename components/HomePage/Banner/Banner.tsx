import Image from "next/image";
import styles from "./Banner.module.scss";

interface BannerProps {
  handleOnClick: () => void;
  buttonText: string;
}

const Banner: React.FC<BannerProps> = ({ buttonText, handleOnClick }) => {
  return (
    <>
      <div className={styles.heroImage}>
        <Image width={700} height={400} src="/static/hero-image.png" alt="hero-image" />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <span className={styles.title1}>Coffee</span>
          <span className={styles.title2}>Connoisseur</span>
        </h1>
        <p className={styles.subTitle}>Discover your local coffee shops!</p>
        <div className={styles.buttonWrapper}>
          <button onClick={handleOnClick} className={styles.button}>
            {buttonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default Banner;
