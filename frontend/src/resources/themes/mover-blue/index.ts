import settings from "resources/settings";

// Configure the Google Maps integration.

// Not that the map IDs may be customized here:
// https://console.cloud.google.com/google/maps-apis/client-styles/TODO:insert-project-id

settings.integrations.googleMaps.parameters.mapIds = ["TODO:insert-map-id"];
settings.integrations.googleMaps.defaults!.mapId = "TODO:insert-map-id";

settings.integrations.legacyGoogleMaps.mapStyleName = "roadmap-light";
