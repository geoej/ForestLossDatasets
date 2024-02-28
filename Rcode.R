# SEI-Trase assignment Ebrahim Jahanshiri
# Visualisation and analysis for task 1.2

# 1b
# Reading country statistics per biome and per country

library(readr)
library(reshape2)
library(ggplot2)

GFW_biomes_stats <- read_csv("GFW_biomes_stats.csv")[,c(2:8)]
GFW_countries_stats <- read_csv("GFW_countries_stats.csv")[,c(2:10)]
TMF_biomes_stats <- read_csv("TMF_biomes_stats.csv")[,c(2:8)]
TMF_countries_stats <- read_csv("TMF_countries_stats.csv")[,c(2:10)]

GFW_biomes_stats$dataset <- "GFW"
GFW_countries_stats$dataset  <- "GFW"
TMF_biomes_stats$dataset  <- "TMF"
TMF_countries_stats$dataset <- "TMF"

# tidying up the dataframw for visualisations
biomes <- rbind(GFW_biomes_stats, TMF_biomes_stats)
colnames(biomes) <- c("Amazonia", "Andes", "Cerrado", "Chaco","Franaise", "Pantanal", "Tucumano-Boliviano", "Dataset")

countries <- rbind(GFW_countries_stats, TMF_countries_stats)
colnames(countries) <- c("Bolivia", "Brazil", "Colombia", "Ecuador", "Guyan", "Guyane Franaise", "Peru", "Surinam", "Venezuela", "Dataset")

# Preparing for plotting 
biomes2 <- melt(biomes, id.vars=c('Dataset'))
countries2 <-  melt(countries, id.vars=c('Dataset'))

# Plotting and saving the outputs

ggplot(biomes2, aes(x=variable, y=value, fill=Dataset)) +
  geom_bar(position='dodge', stat='identity')+
  xlab("Biomes")

ggsave("Biomes.png", dpi = 300)
dev.off()

ggplot(countries2, aes(x=variable, y=value, fill=Dataset)) +
  geom_bar(position='dodge', stat='identity')+
  xlab("Countries")

ggsave("Countries.png", dpi = 300)
dev.off()

#############
# Task 1.2
############
library(sf)

TMF_all <- read_sf("TMF_all_data.shp")
MB_all <- read_sf("MBM_all_classes.shp")
# we want to see how much of the agricultural subclass for each year and how much of natural forest for each year

# the key here was used https://s3.amazonaws.com/amazonia.mapbiomas.org/leyenda/Código_de_la_Leyenda_-_colección_4.pdf

TMF_all = TMF_all %>% select(-contains("_1"))

agriculture <- list()
forest <- list()

library(dplyr)
for (i in c("Dec2010", "Dec2011", "Dec2012", "Dec2013", "Dec2014", "Dec2015", "Dec2016", "Dec2017", "Dec2018", "Dec2019", "Dec2020")){
  
  agriculture[i] <- sum(st_area(filter(TMF_all, .data[[i]] >= 3 & .data[[i]] < 4) %>% select(contains(i))))
  forest[i] <- sum(st_area(filter(TMF_all, .data[[i]] >= 1 & .data[[i]] < 2) %>% select(contains(i))))
  
}


ag <- as.data.frame(agriculture)

frst <- as.data.frame(forest)

diff <- as.data.frame(t(as.numeric(frst) - as.numeric(ag)))
names(diff) <- c("Dec2010", "Dec2011", "Dec2012", "Dec2013", "Dec2014", "Dec2015", "Dec2016", "Dec2017", "Dec2018", "Dec2019", "Dec2020")

# ag$class <- "Agriculture"
# frst$class <- "Forest"
# diff$class <- "Difference"

classes <- as.data.frame(t(rbind(ag, frst, diff)))

names(classes) <- c("Agriculture", "Forest", "Difference")
classes$year <- c("Dec2010", "Dec2011", "Dec2012", "Dec2013", "Dec2014", "Dec2015", "Dec2016", "Dec2017", "Dec2018", "Dec2019", "Dec2020")

classes2 <- melt(classes, id.vars=c('year'))

ggplot(classes2, aes(x=year, y=value, fill=variable)) +
  geom_bar(position='dodge', stat='identity')+
  xlab("Transition")

ggsave('agriclture.png')
dev.off()

