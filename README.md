# SNOTEL

Depicting the varying snowpack levels across years at Mt Hood.

See demo at https://anwarmontasir.github.io/SNOTEL/.

## Challenges faced

Although I reviewed the docs [here](https://www.wcc.nrcs.usda.gov/web_service/AWDB_Web_Service_Reference.htm#_Toc336255535) and [here](https://www.wcc.nrcs.usda.gov/web_service/AWDB_Web_Service_Tutorial.htm), my experience is with REST APIS that produce JSON, and not ones that use SOAP and XML. I couldn't figure out how to fetch the desired data from the NRCS API. 

The [Monthly Snow Data](https://wcc.sc.egov.usda.gov/nwcc/rgrpt?report=snowmonth_hist&state=OR) page at NRCS (Natural Resources Conservation Site) produces a [CSV](https://wcc.sc.egov.usda.gov/reportGenerator/view_csv/customGroupByMonthReport/monthly/651:OR:SNTL%7Cid=%22%22%7Cname/POR_BEGIN,POR_END:1,2,3,4,5,6/WTEQ::collectionDate,SNWD::value,WTEQ::value) of Historic monthly snowfall data at Mount Hood, January through June, every year from 1981 to present.

Inspired by [a blog post by Ben Nadel](https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm), I converted the CSV into an array, and was then able to retrieve the desired data from this array.

[This Stack Overflow post](https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value) on sorting strings by property value was helpful.

## Technologies Used

As the goal here was the fastest delivery possible, I used jQuery for simple DOM manipulation rather than creating a component architecture.

App is mobile-friendly. Text uses responsive CSS units, and table is legible down to 320px, though at that size the text is small (12px) and toggling units to centimeters causes horizontal scrolling.