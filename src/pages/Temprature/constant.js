import { toast } from "react-hot-toast";
import maplibregl from "maplibre-gl";
import { firstLetterUppercase } from "../../utils/firstLetterUppercase";

export const weatherForcast = async ({
  lon,
  lat,
  setForcastData,
  getWeatherForcast,
}) => {
  try {
    setForcastData((prev) => ({ ...prev, loading: true }));
    if (lon && lat) {
      const { data, status } = await getWeatherForcast({ lon, lat });
      if (status === 200)
        setForcastData((prev) => ({
          ...prev,
          loading: false,
          error: "",
          data: data,
        }));
    }
  } catch (error) {
    setForcastData((prev) => ({
      ...prev,
      loading: false,
      error: error.message,
    }));
    toast.error(error.message);
  }
};

export const getPopup = ({ weatherInfo }) => {
  return new maplibregl.Popup({ offset: 25 }).setHTML(` <div>
<p style="font-size:14px; display: flex; align-items: center; margin-top: -10px;">${
    weatherInfo.name
  } <img style="width:40px; object-fit: cover;"  src=https://openweathermap.org/img/wn/${
    weatherInfo.weather[0].icon
  }@2x.png /></p>
<p style="font-size:10px; color: #808080; height: 0; margin-bottom: 15px;">lon: ${
    weatherInfo.coord.lon
  }, lat: ${weatherInfo.coord.lat}</p>
<p style="font-size:10px; color: #808080; height: 0; margin-bottom: 15px;"">${firstLetterUppercase(
    weatherInfo.weather[0].description
  )}, ${weatherInfo.main.temp}°C</p>
</div>`);
};
