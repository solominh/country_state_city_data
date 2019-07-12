const fs = require("fs-extra");
const path = require("path");

const createCountries = async () => {
  const countriesFile = path.join(__dirname, "data", "countries.json");
  const countries = await fs.readJson(countriesFile);

  const cleanedCountries = countries.map(item => {
    const { country, Languages } = item;
    return {
      country
    };
  });

  const file = path.join(__dirname, "dist", "countries.json");
  await fs.outputJson(file, cleanedCountries);

  console.log("Finish createCountries");
};

const createRegions = async () => {
  const regionDir = path.join(__dirname, "data", "region");
  const regionsFilenames = await fs.readdir(regionDir);
  const promises = regionsFilenames.map(async regionFilename => {
    const inputPath = path.join(regionDir, regionFilename);
    const { country_data, regions = [] } = await fs.readJson(inputPath);
    const cleanedRegions = regions.map(region => {
      const { toponymName, adminName1 } = region;
      return {
        toponymName,
        adminName1
      };
    });
    const outputPath = path.join(__dirname, "dist", "region", regionFilename);
    await fs.outputJson(outputPath, { country_data, regions: cleanedRegions });
  });

  await Promise.all(promises);

  console.log("Finish createRegions");
};

const createCities = async () => {
  const regionCityDataDir = path.join(__dirname, "data", "region_city_data");
  const countriesFilenames = await fs.readdir(regionCityDataDir);

  const promises = countriesFilenames.map(async countryFilename => {
    const countryFileDir = path.join(regionCityDataDir, countryFilename);
    const citiesFilenames = await fs.readdir(countryFileDir);

    const promises = citiesFilenames.map(async cityFilename => {
      const inputPath = path.join(countryFileDir, cityFilename);
      const { country_data, region_data, cities = [] } = await fs.readJson(
        inputPath
      );
      const cleanedCities = cities.map(city => {
        const { name, asciiname } = city;
        return {
          name,
          asciiname
        };
      });
      const outputPath = path.join(
        __dirname,
        "dist",
        "region_city_data",
        countryFilename,
        cityFilename
      );
      await fs.outputJson(outputPath, {
        country_data,
        region_data,
        cities: cleanedCities
      });
    });

    await Promise.all(promises);
  });

  await Promise.all(promises);

  console.log("Finish createCities");
};

createCountries();
createRegions();
createCities();

setTimeout(() => {}, 1000000);
