import Fixednavbar from "@/components/navbar/fixednavbar";
import { CityNameImage } from "../allApi/apis";
import Link from "next/link";
import styles from "../styles/404.module.scss";
import Image from "next/image";

const ErrorPage = () => {
  

  let slice = CityNameImage.slice(0, 6);
  
  return (
    <div className={`${styles.media_branding_n} text-center`}>
      <Fixednavbar />
      <div className="d-hide drop-nd"></div>

      <div className="mt-5 pt-5">
        <Image
          src="/images/web_pics/404.png"
          alt="404 img"
          width={180}
          height={120}
        />
        <h2 className="mt-2"> You&#39;ve found a page that doesn&#39;t exist </h2>
      </div>
      <div
        className={`${styles.grid_containerN} container-xxl  container-xl text-center container-lg container-md my-5 p`}
      >
        {slice.map((pos, index) => {
          return (
            <Link href={`/${pos.value}/delhi`} className="text-decoration-none" key={index}>
              <div className={styles.container} >
                <div className={styles.card1}>
                  <div className={styles.logo_img}>{pos.icon}</div>

                  <h3>{pos.label}</h3>
                  <div className={styles.go_corner}>
                    <div className={styles.go_arrow}>→</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ErrorPage;
