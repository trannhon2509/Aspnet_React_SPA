import { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Table, Pagination } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [user, setUser] = useState({ id: 0, userName: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const response = await fetch('api/Users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateUser(user.id);
        } else {
            await createUser();
        }
        fetchUsers();
        setUser({ id: 0, userName: '', password: '' });
        setIsEditing(false);
        setShowModal(false);
    };

    const createUser = async () => {
        await fetch('api/Users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        toast.success('User created successfully!');
    };

    const updateUser = async (id) => {
        await fetch(`api/Users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        toast.success('User updated successfully!');
    };

    const deleteUser = async (id) => {
        await fetch(`api/Users/${id}`, {
            method: 'DELETE'
        });
        fetchUsers();
        toast.success('User deleted successfully!');
    };

    const editUser = (user) => {
        setUser(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <h1>User Management</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>UserName</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.userName}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => editUser(user)}>Edit</Button>
                                        <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="userName"
                            placeholder="UserName"
                            value={user.userName}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleInputChange}
                            className="form-control mt-2"
                        />
                        <Button variant="primary" type="submit" className="mt-3">{isEditing ? 'Update' : 'Create'}</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default UserManagement;
