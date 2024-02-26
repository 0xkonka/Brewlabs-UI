import Carousel from "react-multi-carousel";
import TrueNFT from "./TrueNFT";
import BrewNFT from "./BrewNFT";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1400 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 1400, min: 1000 },
    items: 1,
  },
  small: {
    breakpoint: { max: 1000, min: 100 },
    items: 1,
  },
};

const banners = [
  {
    id: 1,
    component: <TrueNFT />,
  },
  {
    id: 2,
    component: <BrewNFT />,
  },
];

const Banner = () => (
  <div className="mb-5">
    <Carousel
      arrows={false}
      infinite={true}
      autoPlay={true}
      showDots={true}
      autoPlaySpeed={5000}
      responsive={responsive}
    >
      {banners.map((banner, index) => (
        <div key={index} className="relative">
          {banner.component}
        </div>
      ))}
    </Carousel>
  </div>
);

export default Banner;
