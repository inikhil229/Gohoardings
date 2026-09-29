import Image from "next/image";
function Loader() {
  return (
    <div className="loading-container text-center">
      <Image
        width={100}
        height={250}
        src="/images/web_pics/loading.gif"
        className="loading"
      />
      <style jsx>
        {`
          .loading {
            height: 200px !important;
            width: auto;
          }
        `}
      </style>
    </div>
  );
}

export default Loader;
