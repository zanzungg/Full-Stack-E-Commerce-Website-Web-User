import { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { MdEdit } from 'react-icons/md';
import TextField from '@mui/material/TextField';
import AccountSidebar from '../../components/AccountSidebar';
import { useUser } from '../../hooks/useUser';

const MyAccount = () => {
  const { user, refreshUserProfile, updateProfile } = useUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [formFields, setFormFields] = useState({
    name: '',
    mobile: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch user profile khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update formFields khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormFields({
        name: user.name || '',
        mobile: user.mobile || '',
      });
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) setProfileLoading(true);
    try {
      await refreshUserProfile();
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formFields.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formFields.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formFields.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (formFields.mobile && formFields.mobile.trim()) {
      // Validate phone number (basic validation)
      const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
      if (!phoneRegex.test(formFields.mobile.trim())) {
        newErrors.mobile = 'Invalid phone number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await updateProfile({
        name: formFields.name.trim(),
        mobile: formFields.mobile?.trim() || '',
      });

      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormFields({
      name: user?.name || '',
      mobile: user?.mobile || '',
    });
    setErrors({});
    setIsEditMode(false);
  };

  return (
    <section className="py-10 w-full">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[75%]">
            <div className="card bg-white shadow-md rounded-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-bold">My Profile</h2>
                {!isEditMode && (
                  <Button
                    className="btn-org flex items-center gap-2"
                    onClick={() => setIsEditMode(true)}
                    disabled={profileLoading}
                  >
                    <MdEdit className="text-[18px]" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {profileLoading && !user ? (
                <div className="flex justify-center items-center py-20">
                  <CircularProgress size={40} />
                </div>
              ) : isEditMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      name="name"
                      value={formFields.name}
                      onChange={onChangeField}
                      error={!!errors.name}
                      helperText={errors.name}
                      fullWidth
                      required
                      disabled={loading}
                    />

                    <TextField
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={user?.email || ''}
                      fullWidth
                      disabled
                      helperText="Email cannot be changed"
                    />

                    <TextField
                      label="Phone"
                      variant="outlined"
                      name="mobile"
                      value={formFields.mobile}
                      onChange={onChangeField}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      fullWidth
                      disabled={loading}
                      placeholder="+1 234 567 8900"
                    />

                    <TextField
                      label="Account Status"
                      variant="outlined"
                      value={user?.status || 'Active'}
                      fullWidth
                      disabled
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      className="btn-outline"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="btn-org"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CircularProgress
                            size={16}
                            className="mr-2"
                            color="inherit"
                          />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex border-b pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Full Name:
                    </div>
                    <div className="w-[70%]">{user?.name || 'N/A'}</div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Email:
                    </div>
                    <div className="w-[70%] flex items-center gap-2">
                      {user?.email || 'N/A'}
                      {user?.verify_email && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Phone:
                    </div>
                    <div className="w-[70%]">
                      {user?.mobile || 'Not provided'}
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Account Status:
                    </div>
                    <div className="w-[70%]">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user?.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user?.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="flex border-b pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Member Since:
                    </div>
                    <div className="w-[70%]">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </div>
                  </div>

                  <div className="flex pb-4">
                    <div className="w-[30%] font-semibold text-gray-600">
                      Last Login:
                    </div>
                    <div className="w-[70%]">
                      {user?.last_login_date
                        ? new Date(user.last_login_date).toLocaleString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
