import * as ticketmasterService from "../services/ticketmaster.service.js";

export const getEvents = async (req, res) => {
  try {
    const { keyword = "", city = "", sort } = req.query;
    const size =
      req.query.size != null ? parseInt(req.query.size, 10) : undefined;
    const page =
      req.query.page != null ? parseInt(req.query.page, 10) : undefined;

    const data = await ticketmasterService.fetchEvents({
      keyword,
      city,
      sort,
      size,
      page,
    });

    // Normalizar únicamente campos necesarios
    const events = (data._embedded?.events || []).map((evt) => ({
      id: evt.id,
      name: evt.name,
      date: evt.dates.start?.dateTime,
      url: evt.url,
      image: evt.images?.[0]?.url || null,
      description: evt.info || evt.pleaseNote || null,
      venues: (evt._embedded?.venues || []).map((venue) => ({
        id: venue.id,
        name: venue.name,
        address: venue.address?.line1 || "",
        city: venue.city?.name || "",
        state: venue.state?.name || "",
        country: venue.country?.name || "",
        postalCode: venue.postalCode || "",
        location: {
          lat: venue.location?.latitude || null,
          lng: venue.location?.longitude || null,
        },
      })),
      attractions: (evt._embedded?.attractions || []).map((a) => a.name),
    }));

    res.status(200).json({ count: events.length, events });
  } catch (error) {
    console.error("Controller getEvents error:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
};
