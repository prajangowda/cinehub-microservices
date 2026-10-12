import { useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import {
  createTheatre,
  createScreen,
  createShow,
  getOwnerTheatres,
  getTheatreMovies,
  getTheatreScreens,
} from '../services/ownerService.js';
import { Input } from '../components/Input.jsx';

const SCREEN_TYPES = ['TWO_D', 'THREE_D', 'FOUR_D', 'IMAX', 'VIP'];
const MAP_INSTALL_COMMAND = 'npm install react-leaflet leaflet --save --legacy-peer-deps';
const DEFAULT_LOCATION = {
  lat: 13.0115,
  lng: 77.555,
};

function useMapModules() {
  const [modules, setModules] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rl = await import('react-leaflet');
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
          iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
          shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
        });

        if (mounted) setModules({ ...rl, L });
      } catch (err) {
        if (mounted) setError(err?.message || String(err));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { modules, error };
}

function LocationSelector({ position, onPositionChange, mapModules }) {
  const { useMapEvents, Marker, Popup } = mapModules;

  useMapEvents({
    click(event) {
      onPositionChange(event.latlng);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected theatre location</Popup>
    </Marker>
  ) : null;
}

function TheatreDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showList, setShowList] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: DEFAULT_LOCATION.lat,
    longitude: DEFAULT_LOCATION.lng,
    phone: '',
    email: '',
  });
  const [screenForm, setScreenForm] = useState({
    name: 'Screen 1',
    type: 'TWO_D',
    rows: 10,
    seatsPerRow: 15,
  });
  const [position, setPosition] = useState(DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingScreen, setIsSubmittingScreen] = useState(false);
  const [loadingTheatres, setLoadingTheatres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [isSubmittingShow, setIsSubmittingShow] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState({
    theatreId: '',
    movieId: '',
    screenId: '',
    showDate: new Date().toISOString().slice(0, 10),
    startTime: '10:00',
    endTime: '13:00',
  });

  const mapCenter = useMemo(() => [position.lat, position.lng], [position]);
  const { modules: mapModules, error: mapError } = useMapModules();

  const selectedTheatre = useMemo(
    () => theatres.find((theatre) => String(theatre.id ?? theatre.theatreId) === String(selectedTheatreId)) || null,
    [theatres, selectedTheatreId],
  );

  useEffect(() => {
    const loadTheatres = async () => {
      try {
        setLoadingTheatres(true);
        const response = await getOwnerTheatres(user?.id);
        const theatreList = Array.isArray(response)
          ? response
          : response?.content || response?.data || response?.items || [];

        setTheatres(theatreList);

        if (theatreList.length > 0) {
          const firstId = String(theatreList[0].id ?? theatreList[0].theatreId);
          setSelectedTheatreId((current) => current || firstId);
          const firstScreens = theatreList[0].screens || theatreList[0].screenList || [];
          setScreens(Array.isArray(firstScreens) ? firstScreens : []);
        } else {
          setSelectedTheatreId('');
          setScreens([]);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load your theatres.');
      } finally {
        setLoadingTheatres(false);
      }
    };

    const loadMovies = async () => {
      try {
        setLoadingMovies(true);
        const response = await getTheatreMovies();
        const movieList = Array.isArray(response)
          ? response
          : response?.content || response?.data || response?.items || [];
        setMovies(Array.isArray(movieList) ? movieList : []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load movies.');
      } finally {
        setLoadingMovies(false);
      }
    };

    if (user) {
      loadTheatres();
      loadMovies();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!selectedTheatreId) {
      setShowForm((current) => ({ ...current, theatreId: '' }));
      setScreens([]);
      return;
    }

    setShowForm((current) => ({ ...current, theatreId: selectedTheatreId }));
  }, [selectedTheatreId]);

  useEffect(() => {
    const loadSelectedTheatreScreens = async () => {
      if (!selectedTheatreId) {
        setScreens([]);
        return;
      }

      try {
        setLoadingScreens(true);
        const response = await getTheatreScreens(selectedTheatreId);
        const theatreScreens = Array.isArray(response)
          ? response
          : response?.content || response?.data || response?.items || response?.screens || response?.screenList || [];
        setScreens(Array.isArray(theatreScreens) ? theatreScreens : []);
      } catch (err) {
        const fallbackScreens = selectedTheatre?.screens || selectedTheatre?.screenList || [];
        setScreens(Array.isArray(fallbackScreens) ? fallbackScreens : []);
      } finally {
        setLoadingScreens(false);
      }
    };

    if (selectedTheatreId) {
      loadSelectedTheatreScreens();
    }
  }, [selectedTheatreId, selectedTheatre]);

  useEffect(() => {
    if (!selectedTheatre) {
      setScreens([]);
      setProfileForm({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        phone: '',
        email: '',
      });
      setPosition(DEFAULT_LOCATION);
      return;
    }

    const selectedScreens = selectedTheatre.screens || selectedTheatre.screenList || [];
    setScreens(Array.isArray(selectedScreens) ? selectedScreens : []);
    const lat = Number(selectedTheatre.latitude ?? DEFAULT_LOCATION.lat);
    const lng = Number(selectedTheatre.longitude ?? DEFAULT_LOCATION.lng);

    setProfileForm({
      name: selectedTheatre.name || '',
      address: selectedTheatre.address || '',
      city: selectedTheatre.city || '',
      state: selectedTheatre.state || '',
      pincode: selectedTheatre.pincode || '',
      latitude: Number.isFinite(lat) ? lat : DEFAULT_LOCATION.lat,
      longitude: Number.isFinite(lng) ? lng : DEFAULT_LOCATION.lng,
      phone: selectedTheatre.phone || '',
      email: selectedTheatre.email || '',
    });
    setPosition({
      lat: Number.isFinite(lat) ? lat : DEFAULT_LOCATION.lat,
      lng: Number.isFinite(lng) ? lng : DEFAULT_LOCATION.lng,
    });
  }, [selectedTheatre]);

  useEffect(() => {
    if (!selectedTheatre) return;

    const selectedShows = selectedTheatre.shows || selectedTheatre.showList || [];
    setShowList(Array.isArray(selectedShows) ? selectedShows : []);
  }, [selectedTheatre]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleShowChange = (event) => {
    const { name, value } = event.target;
    setShowForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleScreenChange = (event) => {
    const { name, value } = event.target;
    setScreenForm((current) => ({
      ...current,
      [name]: name === 'rows' || name === 'seatsPerRow' ? Number(value) : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const updatePosition = (latlng) => {
    setPosition(latlng);
    setProfileForm((current) => ({
      ...current,
      latitude: Number(latlng.lat.toFixed(6)),
      longitude: Number(latlng.lng.toFixed(6)),
    }));
    setError(null);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    setLoadingSearch(true);
    setSearchResults([]);
    setError(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Location search failed.');
      }

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to search location.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectLocation = (place) => {
    const lat = Number(place.lat);
    const lng = Number(place.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    const addressParts = place.address || {};
    setProfileForm((current) => ({
      ...current,
      address: place.display_name || current.address,
      city: addressParts.city || addressParts.town || addressParts.village || current.city,
      state: addressParts.state || current.state,
      pincode: addressParts.postcode || current.pincode,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
    }));
    setSearchQuery(place.display_name || '');
    setSearchResults([]);
    updatePosition({ lat, lng });
  };

  const handleCreateTheatre = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmittingProfile(true);

    if (!profileForm.name.trim() || !profileForm.address.trim() || !profileForm.city.trim() || !profileForm.phone.trim() || !profileForm.email.trim()) {
      setError('Please fill in the required theatre details.');
      setIsSubmittingProfile(false);
      return;
    }

    try {
      const created = await createTheatre({
        ownerId: user?.id,
        name: profileForm.name,
        address: profileForm.address,
        city: profileForm.city,
        state: profileForm.state,
        pincode: profileForm.pincode,
        latitude: Number(profileForm.latitude),
        longitude: Number(profileForm.longitude),
        phone: profileForm.phone,
        email: profileForm.email,
      });

      const nextTheatre = created?.theatre || created?.data || created;
      const theatreList = nextTheatre ? [nextTheatre, ...theatres] : theatres;
      setTheatres(theatreList);
      setSelectedTheatreId(String(nextTheatre?.id ?? nextTheatre?.theatreId ?? selectedTheatreId));
      setSuccess('Theatre created successfully.');
      setProfileForm({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        phone: '',
        email: '',
      });
      setPosition(DEFAULT_LOCATION);
      setSearchQuery('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create theatre.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleCreateScreen = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedTheatreId) {
      setError('Please select a theatre before adding a screen.');
      return;
    }

    const payload = {
      theatreId: Number(selectedTheatreId),
      name: screenForm.name,
      type: screenForm.type,
      rows: Number(screenForm.rows),
      seatsPerRow: Number(screenForm.seatsPerRow),
    };

    setIsSubmittingScreen(true);

    try {
      const screenResponse = await createScreen(payload);
      const createdScreen = screenResponse?.screen || screenResponse?.data || screenResponse;
      setScreens((current) => [createdScreen, ...current]);
      setSuccess(`Screen created successfully for ${selectedTheatre?.name || 'the selected theatre'}. Seats are generated automatically.`);
      setScreenForm((current) => ({
        ...current,
        name: `Screen ${screens.length + 2}`,
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create screen.');
    } finally {
      setIsSubmittingScreen(false);
    }
  };

  const handleScheduleShow = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!showForm.theatreId || !showForm.movieId || !showForm.screenId || !showForm.showDate || !showForm.startTime || !showForm.endTime) {
      setError('Please complete all show fields before scheduling.');
      return;
    }

    const payload = {
      movieId: Number(showForm.movieId),
      screenId: Number(showForm.screenId),
      showDate: showForm.showDate,
      startTime: `${showForm.startTime}:00`,
      endTime: `${showForm.endTime}:00`,
    };

    setIsSubmittingShow(true);

    try {
      const createdShow = await createShow(payload);
      const scheduledShow = createdShow?.show || createdShow?.data || createdShow;
      setShowList((current) => [scheduledShow, ...current]);
      setSuccess('Show scheduled successfully.');
      setShowForm((current) => ({
        ...current,
        movieId: '',
        screenId: '',
        showDate: new Date().toISOString().slice(0, 10),
        startTime: '10:00',
        endTime: '13:00',
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to schedule show.');
    } finally {
      setIsSubmittingShow(false);
    }
  };

  return (
    <div className="flex gap-6">
      <aside className="w-60 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Owner</h2>
          <p className="text-xs text-slate-400">Choose an action</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
              activeTab === 'details' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-950/60'
            }`}
          >
            Theatre Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('screens')}
            className={`text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
              activeTab === 'screens' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-950/60'
            }`}
          >
            Screen Management
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shows')}
            className={`text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
              activeTab === 'shows' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-950/60'
            }`}
          >
            Show Management
          </button>
        </nav>

        {theatres.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Theatres</p>
            {theatres.map((theatre) => {
              const theatreId = String(theatre.id ?? theatre.theatreId);
              return (
                <button
                  key={theatreId}
                  type="button"
                  onClick={() => setSelectedTheatreId(theatreId)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedTheatreId === theatreId
                      ? 'border-brand-500 bg-brand-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {theatre.name || theatre.theatreName || `Theatre ${theatreId}`}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      <div className="flex-1 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
        <div>
          <h1 className="text-3xl font-semibold text-white">Theatre Dashboard</h1>
          <p className="mt-3 text-slate-400">Manage theatre details and update screens for your cinema.</p>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-6">
            {loadingTheatres ? (
              <p className="text-slate-300">Loading theatres...</p>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
                  {error && <p className="mb-4 rounded-2xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</p>}
                  {success && <p className="mb-4 rounded-2xl bg-emerald-950/60 px-4 py-3 text-sm text-emerald-300">{success}</p>}

                  <form onSubmit={handleCreateTheatre} className="space-y-4">
                    <Input
                      label="Theatre name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="PVR Orion Mall"
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      placeholder="orion@pvr.com"
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="9876543210"
                      required
                    />
                    <Input
                      label="City"
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      placeholder="Bengaluru"
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={profileForm.state}
                      onChange={handleProfileChange}
                      placeholder="Karnataka"
                    />
                    <Input
                      label="Pincode"
                      name="pincode"
                      value={profileForm.pincode}
                      onChange={handleProfileChange}
                      placeholder="560055"
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      placeholder="Orion Mall, Rajajinagar"
                      required
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Latitude"
                        name="latitude"
                        type="number"
                        value={profileForm.latitude}
                        onChange={handleProfileChange}
                        step="0.000001"
                      />
                      <Input
                        label="Longitude"
                        name="longitude"
                        type="number"
                        value={profileForm.longitude}
                        onChange={handleProfileChange}
                        step="0.000001"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingProfile ? 'Saving theatre...' : 'Save theatre details'}
                    </button>
                  </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
                  <div className="flex flex-col gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        label="Search location"
                        name="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search city, mall, street..."
                        className="flex-1"
                      />
                      <button
                        type="submit"
                        disabled={loadingSearch}
                        className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Search
                      </button>
                    </form>
                    {loadingSearch && <p className="text-sm text-slate-400">Searching locations…</p>}
                    {searchResults.length > 0 && (
                      <div className="max-h-64 overflow-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-3">
                        {searchResults.map((place) => (
                          <button
                            key={place.place_id}
                            type="button"
                            onClick={() => handleSelectLocation(place)}
                            className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200 transition hover:border-brand-400 hover:bg-slate-800"
                          >
                            <span className="block font-semibold text-white">{place.display_name}</span>
                            <span className="text-xs text-slate-500">{place.type}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 h-[420px] rounded-3xl border border-slate-800 bg-slate-900/80">
                    {!mapModules && !mapError && (
                      <div className="flex h-full items-center justify-center text-slate-400">Loading map…</div>
                    )}

                    {mapError && (
                      <div className="p-6 text-sm">
                        <p className="text-red-300">Map failed to load: {mapError}</p>
                        <p className="mt-2">Install the required packages and restart the dev server:</p>
                        <pre className="mt-2 rounded bg-slate-950 p-3 text-xs text-slate-200">{MAP_INSTALL_COMMAND}</pre>
                      </div>
                    )}

                    {mapModules && (
                      <mapModules.MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-full rounded-3xl">
                        <mapModules.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationSelector position={position} onPositionChange={updatePosition} mapModules={mapModules} />
                      </mapModules.MapContainer>
                    )}
                  </div>

                  <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Map instructions</p>
                    <p className="mt-2">Click anywhere on the map to choose a theatre location. Search results will update the marker and form values.</p>
                    <p className="mt-2 text-slate-500">Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'screens' && (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">Add Screen</h2>
                  <p className="mt-1 text-sm text-slate-400">Create a screen and automatically generate seats.</p>
                </div>

                {error && <p className="mb-4 rounded-2xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</p>}
                {success && <p className="mb-4 rounded-2xl bg-emerald-950/60 px-4 py-3 text-sm text-emerald-300">{success}</p>}

                <label className="mb-5 block text-sm text-slate-300">
                  Select theatre
                  <select
                    value={selectedTheatreId}
                    onChange={(event) => setSelectedTheatreId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    disabled={theatres.length === 0}
                  >
                    {theatres.length === 0 ? (
                      <option value="">No theatres available</option>
                    ) : (
                      theatres.map((theatre) => (
                        <option key={String(theatre.id ?? theatre.theatreId)} value={String(theatre.id ?? theatre.theatreId)}>
                          {theatre.name || theatre.theatreName || `Theatre ${theatre.id ?? theatre.theatreId}`}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <form onSubmit={handleCreateScreen} className="space-y-5">
                  <Input
                    label="Screen name"
                    name="name"
                    value={screenForm.name}
                    onChange={handleScreenChange}
                    placeholder="Screen 1"
                    required
                  />

                  <label className="block text-sm text-slate-300">
                    Screen type
                    <select
                      name="type"
                      value={screenForm.type}
                      onChange={handleScreenChange}
                      className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    >
                      {SCREEN_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Rows"
                      name="rows"
                      type="number"
                      min="1"
                      value={screenForm.rows}
                      onChange={handleScreenChange}
                      required
                    />
                    <Input
                      label="Seats per row"
                      name="seatsPerRow"
                      type="number"
                      min="1"
                      value={screenForm.seatsPerRow}
                      onChange={handleScreenChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingScreen || !selectedTheatreId}
                    className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingScreen ? 'Creating screen...' : 'Create screen'}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">Screens</h2>
                  <p className="mt-1 text-sm text-slate-400">Current auditorium configuration.</p>
                </div>

                {screens.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-sm text-slate-400">
                    No screens added yet for this theatre.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {screens.map((screen, index) => (
                      <div key={screen.id || `${screen.name}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{screen.name || `Screen ${index + 1}`}</p>
                          <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-300">
                            {screen.type || 'TWO_D'}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300">
                          <div>
                            <span className="text-slate-500">Rows:</span> {screen.rows || screenForm.rows}
                          </div>
                          <div>
                            <span className="text-slate-500">Seats:</span> {screen.seatsPerRow || screenForm.seatsPerRow}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shows' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Show Management</h2>
                  <p className="mt-1 text-sm text-slate-400">Schedule shows and keep screening timelines updated.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('shows')}
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
                >
                  + Schedule New Show
                </button>
              </div>

              {error && <p className="mb-4 rounded-2xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</p>}
              {success && <p className="mb-4 rounded-2xl bg-emerald-950/60 px-4 py-3 text-sm text-emerald-300">{success}</p>}

              <form onSubmit={handleScheduleShow} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-lg font-semibold text-white">Schedule New Show</h3>

                <label className="block text-sm text-slate-300">
                  Theatre
                  <select
                    name="theatreId"
                    value={showForm.theatreId}
                    onChange={handleShowChange}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    disabled={theatres.length === 0}
                  >
                    <option value="">Select Theatre</option>
                    {theatres.map((theatre) => (
                      <option key={String(theatre.id ?? theatre.theatreId)} value={String(theatre.id ?? theatre.theatreId)}>
                        {theatre.name || theatre.theatreName || `Theatre ${theatre.id ?? theatre.theatreId}`}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-slate-300">
                  Movie
                  <select
                    name="movieId"
                    value={showForm.movieId}
                    onChange={handleShowChange}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    disabled={loadingMovies || movies.length === 0}
                  >
                    <option value="">Select Movie</option>
                    {movies.map((movie) => (
                      <option key={movie.id ?? movie.movieId} value={movie.id ?? movie.movieId}>
                        {movie.title || movie.name || 'Movie'}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-slate-300">
                  Screen
                  <select
                    name="screenId"
                    value={showForm.screenId}
                    onChange={handleShowChange}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    disabled={loadingScreens || screens.length === 0 || !showForm.theatreId}
                  >
                    <option value="">Select Screen</option>
                    {screens.map((screen, index) => (
                      <option key={screen.id || `${screen.name}-${index}`} value={screen.id ?? screen.screenId ?? index}>
                        {screen.name || `Screen ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Date
                    <input
                      type="date"
                      name="showDate"
                      value={showForm.showDate}
                      onChange={handleShowChange}
                      className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                      Start Time
                      <input
                        type="time"
                        name="startTime"
                        value={showForm.startTime}
                        onChange={handleShowChange}
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      End Time
                      <input
                        type="time"
                        name="endTime"
                        value={showForm.endTime}
                        onChange={handleShowChange}
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-brand-400"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingShow || !showForm.theatreId || !showForm.movieId || !showForm.screenId}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingShow ? 'Scheduling show...' : 'Schedule Show'}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">Scheduled Shows</h2>
                <p className="mt-1 text-sm text-slate-400">Current scheduled movie screenings.</p>
              </div>

              {showList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-sm text-slate-400">
                  No shows scheduled yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-300">
                    <thead className="border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="px-3 py-3 font-medium">Movie</th>
                        <th className="px-3 py-3 font-medium">Screen</th>
                        <th className="px-3 py-3 font-medium">Date</th>
                        <th className="px-3 py-3 font-medium">Time</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showList.map((show, index) => {
                        const movieName = show.movie?.title || show.movieName || show.movieTitle || `Movie ${show.movieId || index + 1}`;
                        const screenName = show.screen?.name || show.screenName || `Screen ${show.screenId || index + 1}`;
                        const showDate = show.showDate || show.date || '';
                        const start = show.startTime || '10:00:00';
                        const end = show.endTime || '13:00:00';
                        const timeLabel = `${start.slice(0, 5)} - ${end.slice(0, 5)}`;

                        return (
                          <tr key={show.id || `${movieName}-${screenName}-${index}`} className="border-b border-slate-800/80">
                            <td className="px-3 py-3 text-white">{movieName}</td>
                            <td className="px-3 py-3">{screenName}</td>
                            <td className="px-3 py-3">{showDate ? new Date(`${showDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                            <td className="px-3 py-3">{timeLabel}</td>
                            <td className="px-3 py-3">
                              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-300">
                                {show.status || 'SCHEDULED'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TheatreDashboardPage;
