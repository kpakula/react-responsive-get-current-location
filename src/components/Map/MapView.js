import React from "react";
import L from "leaflet";
import { MAP_LAYER, MAP_CREDENTIALS } from "../../utils/Api";
import moment from "moment";
import "./MapView.css";

export class MapView extends React.Component {
  componentDidMount() {
    this.polyline = null;
    this.map = L.map("map", {
      zoom: 5,
      layers: [
        L.tileLayer(MAP_LAYER, {
          attribution: MAP_CREDENTIALS
        })
      ]
    });

    this.layer = L.layerGroup().addTo(this.map);
    this.updateMarkers(this.props.markers);
  }

  componentDidUpdate({ markers }) {
    if (this.props.markers !== markers) {
      this.updateMarkers(this.props.markers);
    }
  }

  initialInfo = (marker) => {
    return (`<p>Your location:<br>` +
    `${marker.city ? marker.city + "" : ""} ` +
    `${marker.country ? marker.country : ""}` +
    `</p>`)
  }

  secondMarkerInfo = (marker) => {
    return (
      `<div class='marker-popup'>` +
      `<p >${marker.title}</p>` +
      `<p>${marker.latitude} | ${marker.longitude}</p>` +
      `<p>${moment(marker.date).format("DD-MM-YYYY HH:mm")}</p>` +
      `</div>`
    )
  }

  updateMarkers(markers) {
    this.layer.clearLayers();

    if (markers.length !== 0) {
      markers.forEach((marker, index) => {
        const currentMarker = L.marker([marker.latitude, marker.longitude], {

        }).addTo(this.layer);

        if (index === 0) {
          currentMarker
            .bindPopup(
              this.initialInfo(marker)
            )
            .openPopup();
        } else {
          currentMarker
            .bindPopup(
              this.secondMarkerInfo(marker)
            )
            .openPopup();
        }
      });

      this.map.panTo(
        new L.LatLng(markers[0].latitude, markers[0].longitude),
        5
      );

      if (markers.length === 1) {
        if (this.polyline !== null) {
          this.polyline.remove();
        }
      }

      if (markers.length === 2) {
        const latlngs = this.getCurrentLatitudeAndLongitude(markers);

        if (this.polyline !== null) {
          this.polyline.remove();
        }

        var polyline = L.polyline(latlngs, { color: "red" }).addTo(this.map);
        polyline
          .bindPopup("Distance: " + markers[1].kilometers + " km")
          .openPopup();
        this.polyline = polyline;

        this.map.fitBounds(polyline.getBounds());
      }
    }
  }


  getCurrentLatitudeAndLongitude = markers => {
    return [
      [markers[0].latitude, markers[0].longitude],
      [markers[1].latitude, markers[1].longitude]
    ];
  };

  render() {
    return <div id="map"></div>;
  }
}
