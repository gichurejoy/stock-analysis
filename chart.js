      const date1Input = document.getElementById('date1');
      const date2Input = document.getElementById('date2');
      const monthSelectDiv = document.getElementById('monthSelectDiv');
      const monthSelect = document.getElementById('monthSelect');
      const lineChart = document.getElementById('lineChart');
      let chartInstance;

      date1Input.addEventListener('change', () => {
          date2Input.min = date1Input.value;
          monthSelectDiv.style.display = 'none';
      });

      date2Input.addEventListener('change', () => {
          date1Input.max = date2Input.value;
          populateMonthSelect();
          monthSelectDiv.style.display = 'block';
      });

      function populateMonthSelect() {
          monthSelect.innerHTML = '';
          const startDate = new Date(date1Input.value);
          const endDate = new Date(date2Input.value);
          while (startDate <= endDate) {
              const option = document.createElement('option');
              option.value = startDate.getMonth() + 1;
              option.text = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(startDate);
              monthSelect.appendChild(option);
              startDate.setMonth(startDate.getMonth() + 1);
          }
      }
      let jsonData; 
      async function fetchData() {
        try {
          const response = await fetch('response.json'); 
          jsonData = await response.json(); 
          console.log(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

      function fetchDataAPI(){

        let url = "http://127.0.0.1:5000/get_data"

        let reqBody ={
            startDate: "2023-01-01",
            endDate: "2023-08-31",
            branch: "DAN002",
            itemCode: "SAL008"
        }

        let reqOpt = {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        }

        fetch(url, reqOpt)
        .then(response => {
            if (!response.ok) {
                throw new Error('ERR1 => Network response was not ok');
              }
              return response.json();
        }).then(data => {
            console.log('Response from the API:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

      }

      function createLineChart(dates, totalQtyIn, totalQtyOut, runningStock) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    const ctx = document.getElementById('lineChart').getContext('2d');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total Qty IN',
                    data: totalQtyIn,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'Total Qty OUT',
                    data: totalQtyOut,
                    borderColor: 'red',
                    fill: false,
                },
                {
                    label: 'Running Stock',
                    data: runningStock,
                    borderColor: 'green',
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Stock Comparison Over Time',
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days', 
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value', 
                    },
                },
            },
        },
    });
}


      function filterData(day, month) {
        let filteredData = jsonData.data;

        if (month !== 'All') {
          filteredData = filteredData.filter(entry => entry["Date Month"] == month);
        }

        const dates = filteredData.map(entry => entry["Date Day"]);
        const totalQtyIn = filteredData.map(entry => entry["Total Qty IN"]);
        const totalQtyOut = filteredData.map(entry => entry["Total Qty OUT"]);
        const runningStock = filteredData.map(entry => entry["Running Stock"]);

        createLineChart(dates, totalQtyIn, totalQtyOut, runningStock);
      }

      function handleMonthSelectChange() {
        const selectedMonth = monthSelect.value;
        filterData('All', selectedMonth);
      }

      async function fetchDataAndCreateChart() {
        // await fetchData(); 
        console.log('I AM HERE')
        fetchDataAPI();
        console.log('NOW I AM HERE')
        // handleMonthSelectChange();
      }


      
    