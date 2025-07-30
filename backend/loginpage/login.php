<?php
session_start();

include '../methods/database.php';

$error_message = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['username'], $_POST['password'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (empty($username) || empty($password)) {
        $error_message = "Username and password are required.";
    } else {
        try {
            $stmt = $conn->prepare("SELECT username, password, role FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                if ($user['password'] === $password) {
                    $_SESSION['username'] = $username;
                    $_SESSION['last_activity'] = time();
                     $_SESSION['role'] = $user['role']; 
                    
                    header("Location: ../adminpage/adminpage.php");
                } else {
                    $error_message = "Invalid password.";
                }
            } else {
                $error_message = "Username not found.";
            }
            
            $stmt->close();
            
        } catch (Exception $e) {
            $error_message = "Database error occurred.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/login.css" />
    <title>Login</title>
</head>
<body>
    <div class="container">
        <div class="loginitems">
            <h1>Login</h1>
            
            <?php if (!empty($error_message)): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php endif; ?>
            
            <form action="" method="post">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>