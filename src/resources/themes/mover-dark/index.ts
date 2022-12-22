import settings from "resources/settings";

// Configure the Google Maps integration.

// Not that the map IDs may be customized here:
// https://console.cloud.google.com/google/maps-apis/studio/styles/24b42a5f2b6002de?project=maps-ext-68143585

settings.integrations.googleMaps.parameters.mapIds = ["a0e891e09ce5971"];
settings.integrations.googleMaps.defaults!.mapId = "a0e891e09ce5971";

settings.integrations.legacyGoogleMaps.mapStyleName = "roadmap-dark";
