/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { DashboardContext } from "contexts/DashboardContext";
import { chevronLeftSVG, DoubleUpSVG } from "./assets/svgs";
import { BigNumberFormat } from "utils/functions";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 720 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 768, min: 530 },
    items: 2,
  },
  small: {
    breakpoint: { max: 530, min: 0 },
    items: 1,
  },
};

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DrawChart = ({ data }: { data: any }) => {
  if (!data.length) return;
  const priceChange = data.length ? data[data.length - 1] - data[0] : 0;
  const chartData: any = {
    series: [
      {
        name: "Price",
        data: data,
      },
    ],
    stroke: { width: 1 },
    options: {
      colors: [priceChange >= 0 ? "#2FD35D" : "#ea3943"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops:
            priceChange >= 0
              ? [
                  {
                    offset: 0,
                    color: "rgb(110, 220, 181)",
                    opacity: 0.4,
                  },
                  {
                    offset: 100,
                    color: "rgb(110, 220, 181)",
                    opacity: 0,
                  },
                ]
              : [
                  {
                    offset: 0,
                    color: "#ea3943",
                    opacity: 0.4,
                  },
                  {
                    offset: 100,
                    color: "#ea3943",
                    opacity: 0,
                  },
                ],
        },
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        y: {
          format: "",
          formatter: (value: any) => {
            return "$" + BigNumberFormat(value);
          },
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
    },
  };

  return (
    <StyledChartPanel down={(priceChange < 0).toString()}>
      {typeof window !== "undefined" ? (
        <Chart options={chartData.options} series={chartData.series} type="area" height={120} />
      ) : (
        ""
      )}
    </StyledChartPanel>
  );
};

const PriceList = () => {
  const { priceHistory }: any = useContext(DashboardContext);

  const CustomRightArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute -right-5 -scale-100 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute -left-5 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };
  return (
    <StyledContainer>
      <Carousel
        responsive={responsive}
        infinite={true}
        draggable={false}
        autoPlay={true}
        autoPlaySpeed={5000}
        arrows={true}
        customRightArrow={<CustomRightArrow onClick={undefined} />}
        customLeftArrow={<CustomLeftArrow onClick={undefined} />}
      >
        {priceHistory.map((data: any, i: number) => {
          let percent = 0,
            price = 0;
          if (data.history.length) {
            price = data.history[data.history.length - 1];
            percent = ((price - data.history[0]) / data.history[0]) * 100;
          }
          return (
            <div className="relative w-[210px] rounded-[20px] border border-[#FFFFFF80] px-[18px] py-3" key={i}>
              <div className="flex items-center">
                <img src={data.logo} alt={""} className="mr-3 w-7 rounded-full" />
                <div className="font-semibold">
                  <div className="text-sm text-white">{data.symbol}</div>
                  <div className={`${percent >= 0 ? "text-[#2FD35D]" : "text-[#ea3943]"} text-xs`}>
                    {percent >= 0 ? "+" : ""}
                    {percent.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="text-right text-xl font-bold text-white">${price.toFixed(2)}</div>

              <DrawChart key={i} data={data.history} />
              <div className={`absolute right-[18px] top-4 ${percent >= 50 ? "" : "hidden"}`}>{DoubleUpSVG}</div>
            </div>
          );
        })}
      </Carousel>
    </StyledContainer>
  );
};

export default PriceList;

const StyledContainer = styled.div`
  width: calc(100% - 30px);
  margin: 0 auto;
  .react-multi-carousel-list {
    position: unset !important;
  }
  position: relative;
  .react-multi-carousel-item {
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 720px) {
    width: 450px;
  }
  @media screen and (max-width: 530px) {
    width: 220px;
  }
`;

const StyledChartPanel = styled.div<{ down: String }>`
  width: calc(100% + 30px);
  margin-left: -20px;
  margin-top: -35px;
  margin-bottom: -30px;
  .apexcharts-tooltip {
    color: white;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    background: ${({ down }) => (down === "true" ? "rgba(234, 57, 67, 0.5)" : "rgba(110, 220, 181, 0.5)")};
  }
  .apexcharts-tooltip-title {
    display: none;
  }
  .apexcharts-xaxistooltip {
    display: none;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    border: none;
  }
  .apexcharts-tooltip-text-y-label {
    display: none;
  }
  .apexcharts-tooltip-marker {
    margin-right: 0;
  }
  .apexcharts-tooltip-text-y-value {
    font-size: 14px;
  }
  .apexcharts-series > path:nth-child(2) {
    stroke-width: 2px !important;
  }
  .apexcharts-tooltip-marker {
    width: 8px !important;
    height: 8px !important;
  }
  .apexcharts-tooltip-y-group {
    padding: 3px 0 1px 0;
  }
  > div:nth-child(2) > div {
    min-height: unset !important;
    margin-top: -23px;
  }
  height: 120px;
`;
