import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Car, ShieldAlert } from 'lucide-react';

export default function RegisterStolenPage() {
  const navigate = useNavigate();
  const { registerStolenVehicle } = useApp();

  const [formData, setFormData] = useState({
    registrationNo: '',
    make: '',
    model: '',
    variant: '',
    color: '',
    fuelType: 'Petrol',
    vehicleType: '4-Wheeler (Car)',
    ownerName: '',
    ownerContact: '',
    firNumber: '',
    complaintId: '',
    policeStation: 'Bhimavaram Traffic PS',
    district: 'West Godavari',
    zone: 'Zone A',
    lastKnownLocation: '',
    identifyingFeatures: ''
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.registrationNo.trim()) {
      setFormError('Please enter Vehicle Registration Number.');
      return;
    }
    if (!formData.make.trim() || !formData.model.trim()) {
      setFormError('Please enter Vehicle Make and Model.');
      return;
    }
    if (!formData.firNumber.trim()) {
      setFormError('Please enter official Police FIR Number.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setFormError('Please enter Owner Name.');
      return;
    }

    const newId = registerStolenVehicle(formData);
    navigate(`/app/stolen/${newId}`);
  };

  return (
    <div className="register-stolen-page">
      <div className="detail-top-nav" style={{ marginBottom: '16px' }}>
        <Link to="/app/stolen" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Stolen Vehicles</span>
        </Link>
      </div>

      <div className="page-header">
        <div className="page-title">
          <Car size={22} color="var(--primary-blue)" />
          <span>Register Stolen Vehicle</span>
        </div>
        <div className="page-subtitle">
          Submit official FIR vehicle theft report into control room monitoring system.
        </div>
      </div>

      {formError && (
        <div className="login-error-alert" style={{ marginBottom: '16px' }}>
          <ShieldAlert size={16} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card register-form-card">
        {/* SECTION 1: VEHICLE INFORMATION */}
        <div className="form-section-title">VEHICLE INFORMATION</div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="registrationNo">
              Registration Number <span className="required">*</span>
            </label>
            <input
              id="registrationNo"
              name="registrationNo"
              type="text"
              className="form-control"
              placeholder="e.g. AP37AB1234"
              value={formData.registrationNo}
              onChange={handleChange}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: '700' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="vehicleType">
              Vehicle Type <span className="required">*</span>
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              className="form-control"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="4-Wheeler (Car)">4-Wheeler (Car / SUV)</option>
              <option value="2-Wheeler (Motorcycle)">2-Wheeler (Motorcycle / Scooter)</option>
              <option value="Commercial Vehicle">Commercial (Auto / Taxi / Bus)</option>
              <option value="Heavy Goods Vehicle">Heavy Goods (Truck / Lorry)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="make">
              Make / Brand <span className="required">*</span>
            </label>
            <input
              id="make"
              name="make"
              type="text"
              className="form-control"
              placeholder="e.g. Hyundai, Tata, Honda"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="model">
              Model <span className="required">*</span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              className="form-control"
              placeholder="e.g. Creta, Swift, Activa"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="variant">Variant</label>
            <input
              id="variant"
              name="variant"
              type="text"
              className="form-control"
              placeholder="e.g. SX (O), VXi"
              value={formData.variant}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="color">
              Color <span className="required">*</span>
            </label>
            <input
              id="color"
              name="color"
              type="text"
              className="form-control"
              placeholder="e.g. White, Black, Silver"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SECTION 2: OWNER INFORMATION */}
        <div className="form-section-title">OWNER INFORMATION</div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="ownerName">
              Owner Full Name <span className="required">*</span>
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              className="form-control"
              placeholder="e.g. M. Suresh Raju"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ownerContact">
              Contact Number <span className="required">*</span>
            </label>
            <input
              id="ownerContact"
              name="ownerContact"
              type="tel"
              className="form-control"
              placeholder="e.g. +91 94401 *****"
              value={formData.ownerContact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SECTION 3: COMPLAINT INFORMATION */}
        <div className="form-section-title">COMPLAINT INFORMATION</div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="firNumber">
              FIR Number <span className="required">*</span>
            </label>
            <input
              id="firNumber"
              name="firNumber"
              type="text"
              className="form-control"
              placeholder="e.g. FIR-2026-00231"
              value={formData.firNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="policeStation">
              Police Station <span className="required">*</span>
            </label>
            <select
              id="policeStation"
              name="policeStation"
              className="form-control"
              value={formData.policeStation}
              onChange={handleChange}
            >
              <option value="Bhimavaram Traffic PS">Bhimavaram Traffic PS</option>
              <option value="Bhimavaram Town PS">Bhimavaram Town PS</option>
              <option value="Bhimavaram Rural PS">Bhimavaram Rural PS</option>
              <option value="Palakollu PS">Palakollu PS</option>
              <option value="Tanuku PS">Tanuku PS</option>
            </select>
          </div>
        </div>

        {/* SECTION 4: LAST KNOWN LOCATION */}
        <div className="form-section-title">LAST KNOWN LOCATION</div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastKnownLocation">
            Location Description <span className="required">*</span>
          </label>
          <input
            id="lastKnownLocation"
            name="lastKnownLocation"
            type="text"
            className="form-control"
            placeholder="e.g. Bhimavaram Bypass Junction near Petrol Bunk"
            value={formData.lastKnownLocation}
            onChange={handleChange}
            required
          />
        </div>

        {/* SECTION 5: IDENTIFYING FEATURES */}
        <div className="form-section-title">IDENTIFYING FEATURES</div>
        <div className="form-group">
          <label className="form-label" htmlFor="identifyingFeatures">
            Unique Vehicle Marks / Scratches / Accessories
          </label>
          <textarea
            id="identifyingFeatures"
            name="identifyingFeatures"
            className="form-control"
            rows={3}
            placeholder="e.g. Deep scratch on rear right fender, modified front bumper, yellow ribbon on mirror..."
            value={formData.identifyingFeatures}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: '24px' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '700' }}>
            REGISTER STOLEN VEHICLE
          </button>
        </div>
      </form>

      <style>{`
        .register-form-card {
          padding: 24px;
        }
      `}</style>
    </div>
  );
}
