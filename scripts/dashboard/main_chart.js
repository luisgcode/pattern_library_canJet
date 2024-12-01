import {
  createSatisfactionPieChart,
  createFlightDistanceChart,
  createLoyalCustomerChart,
  createDistanceChart,
  createSatisfactoryLevelsChart,
  createDelayVsConvenienceChart,
  createAverageSatisfactionByClassChart,
  createDisloyalCustomersTicketPricesChart,
  createStackedBarChart,
} from "./chart.js";
("use strict");

// Load the CSV file / Cargar el archivo CSV
let csvPath = "/scripts/dashboard/customer_satisfaction.csv";

// Fetch data from the CSV file / Obtener los datos del archivo CSV
d3.csv(csvPath)
  .then((data) => {
    // Format the data to include ticket prices / Formatear los datos para incluir los precios de boletos
    const formattedData = data.map((d) => ({
      id: d.id, // Unique identifier / Identificador único
      class: d.Class, // Flight class / Clase de vuelo
      averageSatisfaction: +d["Average Satisfaction"], // Convert average satisfaction to a number / Convertir la satisfacción promedio a número
      flightDistance: +d["Flight Distance"], // Convert flight distance to a number / Convertir la distancia de vuelo a número
      satisfaction: d.satisfaction, // Satisfaction level / Nivel de satisfacción
      customerType: d["Customer Type"], // Type of customer (e.g., Loyal or Disloyal) / Tipo de cliente (por ejemplo, Leal o Desleal)
      ticketPrices: [
        +d["1st Ticket Price"] || 0, // Price of the first ticket / Precio del primer boleto
        +d["2nd Ticket Price"] || 0, // Price of the second ticket / Precio del segundo boleto
        +d["3rd Ticket Price"] || 0, // Price of the third ticket / Precio del tercer boleto
        +d["4th Ticket Price"] || 0, // Price of the fourth ticket / Precio del cuarto boleto
      ].map((price) => Math.round(price * 100) / 100), // Round ticket prices to 2 decimal places / Redondear precios de boletos a 2 decimales
      delayInMinutes: d["Total Departure and Arrival Delay in Minutes"],
    }));

    // Generate existing charts / Generar gráficos existentes
    createDistanceChart(formattedData); // Create chart for flight distance distribution / Crear gráfico de distribución de distancias de vuelo
    createSatisfactionPieChart(formattedData); // Create pie chart for satisfaction levels / Crear gráfico de pastel para niveles de satisfacción
    createSatisfactoryLevelsChart(data); // Create bar chart for satisfaction levels / Crear gráfico de barras para niveles de satisfacción
    createDelayVsConvenienceChart(data); // Create scatter plot for delays vs convenience / Crear gráfico de dispersión para retrasos vs conveniencia
    createAverageSatisfactionByClassChart(formattedData); // Create bar chart for average satisfaction by flight class / Crear gráfico de barras para satisfacción promedio por clase de vuelo
    createFlightDistanceChart(formattedData);

    // Generate new chart for disloyal customers' ticket prices / Generar nuevo gráfico para precios de boletos de clientes desleales
    createDisloyalCustomersTicketPricesChart(formattedData);

    createLoyalCustomerChart(formattedData);
    createStackedBarChart(formattedData);
  })
  .catch((error) => {
    // Log error if the CSV file cannot be loaded / Registrar error si no se puede cargar el archivo CSV
    console.error("Error loading the CSV file:", error);
  });
