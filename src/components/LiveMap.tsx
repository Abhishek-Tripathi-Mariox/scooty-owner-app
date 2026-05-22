import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

export type MapPin = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary';
};

export type LiveMapProps = {
  center?: { latitude: number; longitude: number } | null;
  pins?: MapPin[];
  zoom?: number;
  onSelectPin?: (id: string) => void;
  style?: ViewStyle | ViewStyle[];
};

const DEFAULT_CENTER = { latitude: 28.5355, longitude: 77.391 };

function buildHtml(initialLat: number, initialLng: number, initialZoom: number) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #e6e9ee; }
  .pin { width: 30px; height: 38px; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var post = function(msg){
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  };
  var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${initialLat}, ${initialLng}], ${initialZoom});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    crossOrigin: true,
  }).addTo(map);

  var markers = {};

  function pinIcon(variant){
    var color = variant === 'primary' ? '#fc4c02' : '#16a34a';
    var html = '<svg class="pin" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M15 0C7 0 0 6.5 0 14.5 0 25 15 38 15 38s15-13 15-23.5C30 6.5 23 0 15 0z" fill="' + color + '"/>' +
      '<circle cx="15" cy="14" r="6" fill="#fff"/>' +
      '</svg>';
    return L.divIcon({ className: '', html: html, iconSize: [30,38], iconAnchor: [15,38] });
  }

  function setPins(list){
    var seen = {};
    list.forEach(function(p){
      seen[p.id] = true;
      var existing = markers[p.id];
      if (existing){
        existing.setLatLng([p.lat, p.lng]);
        existing.setIcon(pinIcon(p.variant));
      } else {
        var m = L.marker([p.lat, p.lng], { icon: pinIcon(p.variant) }).addTo(map);
        if (p.title) m.bindPopup('<b>' + p.title + '</b>' + (p.subtitle ? '<br/>' + p.subtitle : ''));
        m.on('click', function(){
          post({ type: 'selectPin', id: p.id });
        });
        markers[p.id] = m;
      }
    });
    Object.keys(markers).forEach(function(k){
      if (!seen[k]){ map.removeLayer(markers[k]); delete markers[k]; }
    });
  }

  function setCenter(lat, lng, zoom){
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], zoom || map.getZoom(), { duration: 0.5 });
  }

  document.addEventListener('message', function(e){ handle(e.data); });
  window.addEventListener('message', function(e){ handle(e.data); });

  function handle(raw){
    try {
      var msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!msg || !msg.type) return;
      if (msg.type === 'pins') setPins(msg.payload || []);
      else if (msg.type === 'center') setCenter(msg.lat, msg.lng, msg.zoom);
    } catch (err) {}
  }

  post({ type: 'ready' });
</script>
</body>
</html>`;
}

export function LiveMap({ center, pins = [], zoom = 15, onSelectPin, style }: LiveMapProps) {
  const webRef = useRef<WebView | null>(null);
  const [ready, setReady] = useState(false);
  const focal = center ?? DEFAULT_CENTER;
  const html = useMemo(
    () => buildHtml(focal.latitude, focal.longitude, zoom),
    [focal.latitude, focal.longitude, zoom],
  );

  const post = (msg: object) => {
    webRef.current?.injectJavaScript(`handle(${JSON.stringify(JSON.stringify(msg))}); true;`);
  };

  const payload = useMemo(
    () =>
      pins
        .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
        .map((p) => ({
          id: p.id,
          lat: p.latitude,
          lng: p.longitude,
          title: p.title || '',
          subtitle: p.subtitle || '',
          variant: p.variant || 'secondary',
        })),
    [pins],
  );

  useEffect(() => {
    if (!ready) return;
    post({ type: 'pins', payload });
  }, [ready, payload]);

  useEffect(() => {
    if (!ready || !center) return;
    post({ type: 'center', lat: center.latitude, lng: center.longitude, zoom });
  }, [ready, center?.latitude, center?.longitude, zoom]);

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        androidLayerType="hardware"
        onMessage={(event) => {
          try {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === 'ready') {
              setReady(true);
            } else if (msg.type === 'selectPin' && onSelectPin) {
              onSelectPin(msg.id);
            }
          } catch {
            // ignore malformed messages
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject, backgroundColor: '#e6e9ee' },
});
