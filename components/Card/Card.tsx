import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import styles from "./Card.module.scss";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  imgUrl: string;
  href: string;
}

const Card: React.FC<CardProps> = ({ name, imgUrl, href }) => {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image className={styles.cardImage} src={imgUrl} alt={name} width={260} height={160} objectFit="cover" />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
