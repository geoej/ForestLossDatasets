# Quantifying the fitness of global datasets for forest Loss in Amazonia by comparing two remote sensing datasets: (1) Global Forest Watch (GFW) which maps the forest gain and losses over time, and (2) Tropical Moist Forest (TMF) data published by the Joint Research Centre – European Commission

Both TMF and GFW datasets provide a consistent time series of forest
loss and deforestation and forest gain. However, TMF data is more
thematically comprehensive and contains deforestation, land degradation
and regrowth for longer period of time. Both datasets are easy to work
with however, GFW data are simpler and more robust in terms of data
storage. Figure 1 shows a map of forest loss that is derived from both
GFW and TMF datasets. For GFW layers band (years) represented as the
same colour to show the overall loss, while band for TMF show both
undisturbed and degraded deforestation. Although there seems to be some
areas of conformity across both datasets, there are discrepancies in the
area representing loss derived from both datasets.

![Map Description automatically
generated](vertopal_b8228afe5fec4b549ceca2d09019997b/media/image1.png){width="6.263888888888889in"
height="4.497916666666667in"}

**Figure 1**: Overall forest loss as estimated by GFW and TMF for the
period 2010-2020

Figure 2 shows a more detailed view of forest loss from both datasets.
At the higher level (left map) there seems to be a good conformity
between the two datasets. Whilst for some areas (right map), there seems
to be a gross miss-calculation for both datasets. For example the area
of airport depicted in the right map is the area belonging to Terra
Indigena Menkragnoti indigenous territory in Pará, Mato Grosso, Brazil,
and TMF were more successful in showcasing the loss whilst GFW is less
accurate, albeit overclassifying the loss.

## 

## ![](vertopal_b8228afe5fec4b549ceca2d09019997b/media/image2.png){width="6.263888888888889in" height="2.9381944444444446in"}

**Figure 2**: Detail representation of differences

For GFW dataset, I have used the "lossyear" band to subset the dataset
for the period 2010 to 2020, and the area of the pixel to estimate the
loss per biomes and per countries. For TFM dataset, deforestation data
for the period 2010 to 2020 were estimated considering From
undisturbed/degraded TMF to deforested land. The boundaries of biomes
and countries were derived directly from MapBiomas dataset.

Figure 3 shows the performance of two datasets to estimate forest loss
both across biomes and countries. Both datasets show the highest loss
belongs to the Amazonia biome that is mostly located in Brazil. However,
there is a stark difference between the two datasets in terms of
quantification of forest loss. Except for Peru, GFW shows more forest
loss across biomes and categories compared to TFM. Apart from other
differences, in terms of data that was used for estimating the loss, TFM
methodology seems to lacking behind GFW since the definition of
degraded/deforested land under TFM methodology mandate continual
classification of any area under such categories for 2.5 year (Vancutsem
et al., 2021). This could be the reason behind underestimation of
deforestation on the part of TFM. Also, long term observations allows a
better analysis of transitions to be performed under TFM model.

![Chart, bar chart, histogram Description automatically
generated](vertopal_b8228afe5fec4b549ceca2d09019997b/media/image3.png){width="4.666666666666667in"
height="3.0007403762029745in"}

![Chart, bar chart, histogram Description automatically
generated](vertopal_b8228afe5fec4b549ceca2d09019997b/media/image4.png){width="4.666666666666667in"
height="3.0007392825896764in"}

**Figure 3**: Comparison between GFW and TMF in forest loss for biomes
and countries
