import React from "react";
import { Slider, ConfigProvider } from "antd";
import { THEME } from "@/constants";

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ value, onChange }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME.COLORS.SLIDER_THUMB
        },
        components: {
          Slider: {
            trackBg: THEME.COLORS.SLIDER_THUMB,
            handleColor: THEME.COLORS.SLIDER_THUMB,
            railBg: THEME.COLORS.SLIDER_RAIL,
            handleActiveColor: THEME.COLORS.SLIDER_THUMB
          }
        }
      }}
    >
      <Slider min={1} max={3} step={0.01} style={{ width: "auto", flexGrow: 1 }} value={value} onChange={onChange} />
    </ConfigProvider>
  );
};

export default CustomSlider;
