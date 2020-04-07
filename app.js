//load dorp down and send initial patient details to charts and demographics
function initial_data(){
    var dropdown_ids = d3.select("#selDataset");
    d3.json("samples.json").then((incomingData) => {
        console.log(incomingData)
        var patientnames = incomingData.names;       
        //console.log(testnames);

        patientnames.forEach((element) => {
            //console.log(element);
            dropdown_ids.append("option").text(element).property("value",element);

        });
        var initial_patient = patientnames[0];
        //console.log(patientnames);
        //console.log(patientnames[0]);
        patientcharts(initial_patient);
        patientdemographics(initial_patient);
        });
    };


//function to load charts
function patientcharts(patient){
    var return_patient_sampledata=[];
    var output;
    d3.json("samples.json").then((incomingData)=>{
        var sampledata = incomingData.samples;
        return_patient_sampledata = sampledata.filter(sampleObj => sampleObj.id == patient);
        output = return_patient_sampledata[0];
        //console.log(output);
        
        //Bar Chart
        var y_axis = output.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
          {
            y: y_axis,
            x: output.sample_values.slice(0, 10).reverse(),
            text: output.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
          }
        ];
    
        var barLayout = {
          title: "Top 10 Bacteria Cultures for " + output.id,
          margin: { t: 30, l: 150 }
        };
    
        Plotly.newPlot("bar", barData, barLayout);
        
        //Bubble Chart
        var bubbleLayout = {
          title: "Bacteria Cultures for "+output.id,
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30}
        };
        var bubbleData = [
          {
            x: output.otu_ids,
            y: output.sample_values,
            text: output.otu_labels,
            mode: "markers",
            marker: {
              size: output.sample_values,
              color: output.otu_ids,
            }
          }
        ];
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

//funtion to load demographics information
function patientdemographics(patient){
    var return_patient_metadata=[];
    var output;
    

    d3.json("samples.json").then((incomingData)=>{
        var metadata = incomingData.metadata;
        return_patient_metadata = metadata.filter(sampleObj => sampleObj.id == patient);
        output = return_patient_metadata[0];
        //console.log(output);
        var demographics = d3.select("#sample-metadata");

        demographics.html(" ");

        for (let [key, value] of Object.entries(output)) {
        //    console.log(key, value);
        demographics
            .append("h5")
            .text(`${key}: ${value}`);
        };
    });
};

//Keep changing the patient details based on dropdown bar selection
function optionChanged(patient){
    patientdemographics(patient);
    patientcharts(patient);
}

//making sure the initial function for drop down loads automatically
initial_data();