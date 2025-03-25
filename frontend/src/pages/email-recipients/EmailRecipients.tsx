import { useState } from "react";

import {
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/common/button/Button";
import { FormField } from "@/components/common/form-field/FormField";
import Loader from "@/components/common/loader/Loader";
import { Modal } from "@/components/common/modal/Modal";

import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";

import "./EmailRecipients.scss";

// Define types based on the backend schema
interface EmailRecipient {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateEmailRecipientDto {
  email: string;
  name?: string;
  active?: boolean;
}

type UpdateEmailRecipientDto = Partial<CreateEmailRecipientDto>;

export default function EmailRecipients() {
  // State for form management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] =
    useState<EmailRecipient | null>(null);
  const [formData, setFormData] = useState<CreateEmailRecipientDto>({
    email: "",
    name: "",
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipients
  const {
    data: recipients,
    isLoading,
    refetch,
  } = useApiQuery<EmailRecipient[]>("/email-recipients", {
    onError: (error: Error) => {
      setError(`Failed to fetch recipients: ${error.message}`);
    },
  });

  // Create recipient mutation
  const createMutation = useApiMutation<
    EmailRecipient,
    CreateEmailRecipientDto
  >("/email-recipients", {
    onSuccess: () => {
      refetch();
      setShowAddModal(false);
      resetForm();
    },
    onError: (error: Error) => {
      setError(`Failed to create recipient: ${error.message}`);
    },
  });

  // Update recipient mutation
  const updateMutation = useApiMutation<
    EmailRecipient,
    UpdateEmailRecipientDto
  >(selectedRecipient ? `/email-recipients/${selectedRecipient.id}` : "", {
    method: "PUT",
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
      setSelectedRecipient(null);
    },
    onError: (error: Error) => {
      setError(`Failed to update recipient: ${error.message}`);
    },
  });

  // Delete recipient mutation
  const deleteMutation = useApiMutation<void, void>(
    selectedRecipient ? `/email-recipients/${selectedRecipient.id}` : "",
    {
      method: "DELETE",
      onSuccess: () => {
        refetch();
        setShowDeleteModal(false);
        setSelectedRecipient(null);
      },
      onError: (error: Error) => {
        setError(`Failed to delete recipient: ${error.message}`);
      },
    }
  );

  // Filter recipients based on search term
  const filteredRecipients = recipients?.filter((recipient) => {
    if (!debouncedSearchTerm) return true;
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      recipient.email.toLowerCase().includes(searchLower) ||
      (recipient.name?.toLowerCase() || "").includes(searchLower)
    );
  });

  // Handle form changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create form submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  // Handle update form submission
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient) return;
    updateMutation.mutate(formData);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!selectedRecipient) return;
    deleteMutation.mutate();
  };

  // Handle edit button click
  const handleEditClick = (recipient: EmailRecipient) => {
    setSelectedRecipient(recipient);
    setFormData({
      email: recipient.email,
      name: recipient.name || "",
      active: recipient.active,
    });
    setShowEditModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (recipient: EmailRecipient) => {
    setSelectedRecipient(recipient);
    setShowDeleteModal(true);
  };

  // Handle toggling active status
  const handleToggleActive = (recipient: EmailRecipient) => {
    setSelectedRecipient(recipient);
    updateMutation.mutate({
      active: !recipient.active,
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      active: true,
    });
    setError(null);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Modal components
  const addModalContent = (
    <form onSubmit={handleCreateSubmit}>
      {error && (
        <div className="error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <FormField
        formType="generic"
        label="Email Address"
        name="email"
        type="email"
        required={true}
        value={formData.email}
        onChange={handleFormChange}
        placeholder="Enter email address"
      />

      <FormField
        formType="generic"
        label="Name"
        name="name"
        required={false}
        value={formData.name}
        onChange={handleFormChange}
        placeholder="Enter name"
      />

      <div className="form-field">
        <label className="form-field__label">Active</label>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleFormChange}
            className="form-field__checkbox"
          />
        </div>
      </div>
    </form>
  );

  const addModalFooter = (
    <div className="modal-actions">
      <Button variant="ghost" onClick={() => setShowAddModal(false)}>
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={handleCreateSubmit}
        isLoading={createMutation.isPending}
      >
        Save Recipient
      </Button>
    </div>
  );

  const editModalContent = (
    <form onSubmit={handleUpdateSubmit}>
      {error && (
        <div className="error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <FormField
        formType="generic"
        label="Email Address"
        name="email"
        type="email"
        required={true}
        value={formData.email}
        onChange={handleFormChange}
        placeholder="Enter email address"
      />

      <FormField
        formType="generic"
        label="Name"
        name="name"
        required={false}
        value={formData.name}
        onChange={handleFormChange}
        placeholder="Enter name"
      />

      <FormField
        formType="generic"
        label="Active"
        name="active"
        type="checkbox"
        required={false}
        value={formData.active}
        onChange={handleFormChange}
      />
    </form>
  );

  const editModalFooter = (
    <>
      <Button variant="ghost" onClick={() => setShowEditModal(false)}>
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={handleUpdateSubmit}
        isLoading={updateMutation.isPending}
      >
        Update Recipient
      </Button>
    </>
  );

  const deleteModalContent = (
    <>
      {error && (
        <div className="error-message">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <p>
        Are you sure you want to delete the recipient
        <strong> {selectedRecipient?.email}</strong>?
      </p>
      <p className="text-danger">This action cannot be undone.</p>
    </>
  );

  const deleteModalFooter = (
    <>
      <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
        Cancel
      </Button>
      <Button
        variant="danger"
        onClick={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      >
        Delete
      </Button>
    </>
  );

  return (
    <div className="email-recipients-container">
      <div className="page-header">
        <h1>Email Recipients</h1>
        <Button onClick={handleAddClick} leftIcon={<Plus size={16} />}>
          Add Recipient
        </Button>
      </div>

      {error && (
        <div className="error-message main-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="search-container">
        <FormField
          showLabel={false}
          formType="generic"
          label="Search"
          name="search"
          type="text"
          placeholder="Search recipients..."
          value={searchTerm}
          onChange={(
            event: React.ChangeEvent<
              HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
            >
          ) => setSearchTerm(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loader-container">
          <Loader isLoading={true} />
        </div>
      ) : (
        <div className="recipients-table-wrapper">
          <table className="recipients-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipients?.length ? (
                filteredRecipients.map((recipient) => (
                  <tr key={recipient.id}>
                    <td>{recipient.email}</td>
                    <td>{recipient.name || "-"}</td>
                    <td>
                      <span
                        className={`status-badge ${recipient.active ? "active" : "inactive"}`}
                      >
                        {recipient.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(recipient)}
                        leftIcon={
                          recipient.active ? (
                            <XCircle size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )
                        }
                      >
                        {recipient.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(recipient)}
                        leftIcon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(recipient)}
                        leftIcon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">
                    {searchTerm
                      ? "No matching recipients found"
                      : "No recipients found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Recipient"
        footer={addModalFooter}
      >
        {addModalContent}
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Recipient"
        footer={editModalFooter}
      >
        {editModalContent}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
        footer={deleteModalFooter}
      >
        {deleteModalContent}
      </Modal>
    </div>
  );
}
