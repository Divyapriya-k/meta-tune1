import user from "../Models/app.schema.js";

export const getUser = async (req, res) => {
    try {
        //const userId = req.user._id;
        const user = await user.find();
        res.status(200).json({ message: "Authorized User", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        //console.log(hashpassword);
        const newUser = new user({ username, email, password: hashpassword, role });
        await newUser.save();
        res.status(200).json({ message: "user registered successfuly", data: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        user.token = token;
        await user.save();
        res.status(200).json({ message: "user logged in successfully ", token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await user.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, role } = req.body;
        const user = await user.findByIdAndUpdate(userId, { username, email, role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  