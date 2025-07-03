async function handleScrape(config) {
    const { buttonId, loaderId, linksId, resources } = config;

    const button = document.getElementById(buttonId);
    const loader = document.getElementById(loaderId);
    const links = document.getElementById(linksId);

    button.disabled = true;
    button.innerText = 'Loading... Please wait';
    loader.style.display = 'block';
    links.style.display = 'none';

    try {
      await new Promise(res => setTimeout(res, 10000));
      await Promise.all(resources.map(async r => {
        const response = await fetch(r.url);
        const data = await response.text();
        const blob = new Blob([data], { type: r.type });
        const objUrl = URL.createObjectURL(blob);
        document.getElementById(r.viewId).href = objUrl;
        document.getElementById(r.downloadId).href = objUrl;
      }));
      links.style.display = 'block';
    } catch (err) {
      alert('Failed to retrieve data. Please try again.');
    } finally {
      button.disabled = false;
      button.innerText = button.getAttribute('data-original') || 'Retry';
      loader.style.display = 'none';
    }
  }

  // Configs
  document.getElementById('scrapeTodayBtn').setAttribute('data-original', 'Scrape Today');
  document.getElementById('scrapeTomorrowBtn').setAttribute('data-original', 'Scrape Tomorrow');
  document.getElementById('scrapeAnalysisBtn').setAttribute('data-original', 'Get Match Analysis');

  document.getElementById('scrapeTodayBtn').addEventListener('click', () =>
    handleScrape({
      buttonId: 'scrapeTodayBtn',
      loaderId: 'loaderToday',
      linksId: 'downloadTodayLinks',
      resources: [
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/today.json', type: 'application/json', downloadId: 'todayJsonDownload', viewId: 'viewTodayJson' },
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/today.txt', type: 'text/plain', downloadId: 'todayTxtDownload', viewId: 'viewTodayTxt' }
      ]
    }));

  document.getElementById('scrapeTomorrowBtn').addEventListener('click', () =>
    handleScrape({
      buttonId: 'scrapeTomorrowBtn',
      loaderId: 'loaderTomorrow',
      linksId: 'downloadTomorrowLinks',
      resources: [
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/tomorrow.json', type: 'application/json', downloadId: 'tomorrowJsonDownload', viewId: 'viewTomorrowJson' },
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/tomorrow.txt', type: 'text/plain', downloadId: 'tomorrowTxtDownload', viewId: 'viewTomorrowTxt' }
      ]
    }));

  document.getElementById('scrapeAnalysisBtn').addEventListener('click', () =>
    handleScrape({
      buttonId: 'scrapeAnalysisBtn',
      loaderId: 'loaderAnalysis',
      linksId: 'downloadAnalysisLinks',
      resources: [
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/today_analysis.json', type: 'application/json', downloadId: 'todayAnalysisJsonDownload', viewId: 'viewTodayAnalysisJson' },
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/today_analysis.txt', type: 'text/plain', downloadId: 'todayAnalysisTxtDownload', viewId: 'viewTodayAnalysisTxt' },
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/tomorrow_analysis.json', type: 'application/json', downloadId: 'tomorrowAnalysisJsonDownload', viewId: 'viewTomorrowAnalysisJson' },
        { url: 'https://sparkling-sunset-e7d3.henrygreen311.workers.dev/api/tomorrow_analysis.txt', type: 'text/plain', downloadId: 'tomorrowAnalysisTxtDownload', viewId: 'viewTomorrowAnalysisTxt' }
      ]
    }));