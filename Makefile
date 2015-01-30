R:

	Rscript -e "rmarkdown::render('data/snowfall-totals.Rmd')"
	open data/snowfall-totals.html

R_deploy:

	cp data/snowfall-totals.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/snowfall-totals_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/snowfall-totals.html

css:

	cp node_modules/leaflet/dist/leaflet.css graphics/map/css/_leaflet.scss

download:
	cd data; \
		rm -rf input; \
		mkdir input; \
		cd input; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/cttowns.zip > cttowns.zip; unzip cttowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/state/townssurvey_shp.zip > matowns.zip; unzip matowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/metowns.zip > metowns.zip; unzip metowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/nhtowns.zip > nhtowns.zip; unzip nhtowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/nytowns.zip > nytowns.zip; unzip nytowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/ritowns.zip > ritowns.zip; unzip ritowns.zip; \
			curl http://wsgw.mass.gov/data/gispub/shape/ne/vttowns.zip > vttowns.zip; unzip vttowns.zip;