import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaBook,
  FaLayerGroup,
  FaClock,
  FaUserCircle,
  FaShieldAlt
} from "react-icons/fa";

import { getMyProfile, updateMyProfile } from "../../api/profileApi";
import { getExamSeasons } from "../../api/examSeasonsApi";
import { getExamsBySeason } from "../../api/examsApi";
import { getSubjects } from "../../api/subjectsApi";
import { getStudyBlocksByExam } from "../../api/studyBlocksApi";

import ChangePasswordModal from "./ChangePasswordModal";
import "../../styles/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [examCount, setExamCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [studyBlockCount, setStudyBlockCount] = useState(0);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const profileRes = await getMyProfile();
      setProfile(profileRes.data);
      setFullName(profileRes.data.fullName);

      const subjectsRes = await getSubjects();
      setSubjectCount(subjectsRes.data?.length || 0);

      const today = new Date();
      const seasons = (await getExamSeasons()).data || [];

      const active = seasons.find(
        s => new Date(s.startDate) <= today && new Date(s.endDate) >= today
      );

      if (!active) {
        setExamCount(0);
        setStudyBlockCount(0);
        return;
      }

      const examsRes = await getExamsBySeason(active.id);
      const exams = examsRes.data || [];
      setExamCount(exams.length);

      let blocksTotal = 0;
      for (const exam of exams) {
        const blocksRes = await getStudyBlocksByExam(exam.id);
        blocksTotal += (blocksRes.data || []).length;
      }
      setStudyBlockCount(blocksTotal);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await updateMyProfile({ fullName });
      setProfile(res.data);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) return null;

  const initials = profile.fullName
    .split(" ")
    .map(x => x[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-initials large">
            {initials}
          </div>

          <div className="profile-name-block">
            <h2>{profile.fullName}</h2>

            <div className="profile-roles">
              {profile.roles.map(r => (
                <span key={r} className="role-badge light">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-stats below">
          <div className="profile-stat">
            <FaBook />
            <span><strong>{examCount}</strong> Exams</span>
          </div>
          <div className="profile-stat">
            <FaLayerGroup />
            <span><strong>{subjectCount}</strong> Subjects</span>
          </div>
          <div className="profile-stat">
            <FaClock />
            <span><strong>{studyBlockCount}</strong> Study Blocks</span>
          </div>
        </div>
      </div>

      <div className="profile-content narrow">

        <section className="profile-card">
          <h5 className="card-title">
            <span className="card-icon blue">
              <FaUserCircle />
            </span>
            Account Information
          </h5>

          <div className="profile-row">
            <span><FaEnvelope /> Email: </span>
            <strong>{profile.email}</strong>
          </div>

          <label className="mt-3">Full Name</label>
          <input
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <button
            className="btn btn-primary mt-3"
            disabled={saving || fullName === profile.fullName}
            onClick={saveProfile}
          >
            Save Changes
          </button>
        </section>

        <section className="profile-card danger">
          <h5 className="card-title">
            <span className="card-icon red">
              <FaShieldAlt />
            </span>
            Security
          </h5>

          <div className="security-row">
            <div>
              <strong>Password</strong>
              <div className="text-muted small">
                Last changed 30 days ago
              </div>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={() => setShowPasswordModal(true)}
            >
              <FaLock className="me-2" />
              Change Password
            </button>
          </div>
        </section>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}
