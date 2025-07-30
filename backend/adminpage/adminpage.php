<?php
session_start();

if (empty($_SESSION['username']) || empty($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    session_unset();
    session_destroy();
    header('Location: ../loginpage/login.php?message=not_authorized');
    exit();
}

$timeout_duration = 1800; 
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout_duration) {
    session_unset();    
    session_destroy();
    header("Location: ../loginpage/login.php?message=session_expired");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header("Location: ../loginpage/login.php?message=logged_out");
    exit();
}

$_SESSION['last_activity'] = time();

$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/adminpage.css"/>
    <script type="module" src="../scripts/server.js"></script>
    <title>Admin Dashboard</title>
</head>
<body>
    <div class="header">
    <h1>Dashboard</h1>
    <div class="user-info">
        <span>Welcome, <?php echo htmlspecialchars($username); ?>!</span>
        <form method="POST" style="display: inline;">
            <button type="submit" name="logout" class="logout-btn">Logout</button>
           </form>
        </div>
    </div>

    <div class="visitors">
  <div class="visitor-details">
    <h1>Visitors</h1>
    <div class="visitor-header">
      <span>IP Address</span>
      <span>Platform</span>
      <span>Country</span>
      <span>City</span>
      <span>Region</span>
      <span>Page</span>
      <span>Time</span>
    </div>
    <div id="visitor-list"></div>
    </div>
    </div>

    <div class="addusers">
        <h1>Add Users</h1>
        <form id="add-user-form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <label for="role">Role:</label>
            <select id="role" name="role" required>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <br>
            <button type="submit">Add User</button>
        </form>
    </div>

</body>
</html>