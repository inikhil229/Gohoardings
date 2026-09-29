import React from "react";
import { MdLocalOffer } from "react-icons/md";
import Link from "next/link";
import styles from "@/styles/mediaN.module.scss";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Loader from "@/components/loader";
import Image from "next/image";
import { getImageUrl } from "@/assets/scss/CleanImageurl";

const Mediacard = ({ slice, addonCart, removefromCart, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div className="container">
          <div className={`${styles.no_data} row text-center my-3`}>
            <Loader />
          </div>
        </div>
      ) : slice.length >= 1 ? (
        <div className={styles.card_media}>
          {slice.map((item, i) => (
            <div
              className={`${styles.project} mt-2 animate__animated animate__fadeIn`}
              key={i}
              title={`${item.subcategory} at ${item.medianame}`}
            >
              <div className={`${styles.img_responsive} ${styles.figure}`}>
                <Link
                  href={`/seedetails/${item.category_name}/${item.page_title}/${item.code}`}
                  className="text-decoration-none"
                >
                  <Image
                    width={200}
                    height={200}
                    className={`${styles.img_responsive_media} rounded_top`}
                    alt={item?.mediaownercompanyname || "media-image"}
                    src={getImageUrl(item)}
                    onError={(e) => {
                      e.currentTarget.src = "/images/web_pics/alter-img.png";
                    }}
                  />
                </Link>

                <figcaption className="rounded-top">
                  <Link
                    href={`/seedetails/${item.category_name}/${item.page_title}/${item.code}`}
                    className="text-decoration-none"
                  >
                    <span className={styles.project_details}>
                      {item.subcategory} at {item.medianame?.substring(0, 6)}...
                    </span>
                  </Link>

                  <span className={`${styles.project_creator} mt-2 ms-0`}>
                    <HiOutlineCurrencyRupee
                      className={`${styles.rupees_logo} icon-clr`}
                    />{" "}
                    Price{" "}
                    <span className="text-muted">
                      {parseInt((item.price * 11) / 10 / 30)}
                    </span>
                    <span className={`ms-2 ${styles.off_text}`}>9% off</span>
                  </span>

                  <span className={`${styles.project_creator} mt-2 ms-0`}>
                    <MdLocalOffer className={`${styles.offer_logo} icon-clr`} />{" "}
                    Offer {parseInt(item.price / 30)}
                  </span>

                  <span className={styles.project_price}>
                    {item.isDelete === 0 ? (
                      <Image
                        width={100}
                        height={100}
                        alt="check"
                        src="/images/web_pics/A-chek.png"
                        onClick={() => removefromCart(item)}
                        className={styles.addonCart}
                      />
                    ) : (
                      <Image
                        width={100}
                        height={100}
                        alt="cart-icon"
                        src="/images/web_pics/A-cart.png"
                        onClick={() => addonCart(item)}
                        className={styles.addonCart}
                      />
                    )}
                  </span>
                </figcaption>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container">
          <div className={`${styles.no_data} row text-center my-3`}>
            <Image
              width={200}
              height={200}
              alt="no-data"
              style={{ opacity: ".7" }}
              src="/images/web_pics/no-data.png"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Mediacard;
