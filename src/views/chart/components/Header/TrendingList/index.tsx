import { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import { useGlobalState } from "state";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 0 },
    items: 1,
  },
};

export default function TrendingList({ trendings }) {
  const showCount = 3;
  const carouselRef = useRef();
  const [filteredTrendings, setFilteredTrendings] = useState([]);

  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");

  useEffect(() => {
    let temp = [],
      _fTrendings = [];
    for (let i = 0; i < trendings.length; i++) {
      temp.push(trendings[i]);
      if (i % showCount === showCount - 1) {
        _fTrendings.push(temp);
        temp = [];
      }
    }
    if (temp.length) _fTrendings.push(temp);
    setFilteredTrendings(_fTrendings);
  }, [trendings]);
  
  return (
    <div className="primary-shadow flex h-[44px] w-[300px] flex-col justify-center rounded bg-[#b9b8b8f] px-4 md:w-[360px]">
      <Carousel
        arrows={false}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        ref={carouselRef}
      >
        {filteredTrendings.map((trendings, i) => {
          return (
            <div className="flex" key={i}>
              {trendings.map((data, j) => {
                return (
                  <div key={j} className="mr-2 flex w-[110px] items-center">
                    <img
                      src={getTokenLogoURL(isAddress(data.address), data.chainId)}
                      alt={""}
                      className="mr-2 h-5 w-5 rounded-full"
                    />
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#FFFFFF]">
                      {data.symbol}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
