const Coffee = require('../models/Coffee');
const slugify = require('../utils/slugify');

/**
 * @desc    Get all active coffee listings (supports search and pagination)
 * @route   GET /api/coffees
 * @access  Public
 */
const getCoffees = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;

    // Build filter query for active coffees
    const filter = { isActive: true };

    // Apply search filter if search parameter is provided
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    // Pagination configuration
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 12;
    const skipIndex = (currentPage - 1) * itemsPerPage;

    // Get total matching active documents
    const total = await Coffee.countDocuments(filter);
    const totalPages = Math.ceil(total / itemsPerPage);

    // Fetch paginated results sorted by newest first
    const coffees = await Coffee.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(itemsPerPage);

    return res.status(200).json({
      success: true,
      message: 'Active coffee catalog retrieved successfully.',
      data: {
        coffees,
        pagination: {
          page: currentPage,
          limit: itemsPerPage,
          total,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single coffee details (with optional ownership flag)
 * @route   GET /api/coffees/:id
 * @access  Public
 */
const getCoffeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find coffee and populate creator name and role
    const coffee = await Coffee.findOne({ _id: id, isActive: true })
      .populate('createdBy', 'name role');

    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee listing not found or is inactive.'
      });
    }

    // Determine ownership based on req.user attached by optionalAuth middleware
    const isOwner = !!(
      req.user &&
      coffee.createdBy &&
      coffee.createdBy._id.toString() === req.user._id.toString()
    );

    return res.status(200).json({
      success: true,
      message: 'Coffee details retrieved successfully.',
      data: {
        ...coffee.toObject(),
        isOwner
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new coffee listing
 * @route   POST /api/coffees
 * @access  Private
 */
const createCoffee = async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;

    // Verify case-insensitive name uniqueness
    const existingName = await Coffee.findOne({
      name: { $regex: new RegExp('^' + name.trim() + '$', 'i') }
    });
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'A coffee listing with this name already exists.'
      });
    }

    // Automatically generate slug
    const slug = slugify(name);

    // Verify uniqueness of slug
    const existingSlug = await Coffee.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A coffee listing with a similar name already exists.'
      });
    }

    // Create coffee list entry
    const coffee = await Coffee.create({
      name,
      slug,
      description,
      imageUrl,
      totalVotes: 0,
      isActive: true,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Coffee listing successfully created.',
      data: coffee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update coffee listing
 * @route   PUT /api/coffees/:id
 * @access  Private/Admin
 */
const updateCoffee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const coffee = await Coffee.findById(id);
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee listing not found.'
      });
    }

    // Update name and regenerate slug if needed
    if (name && name.trim() !== coffee.name) {
      // Check case-insensitive name conflict
      const nameConflict = await Coffee.findOne({
        name: { $regex: new RegExp('^' + name.trim() + '$', 'i') },
        _id: { $ne: id }
      });
      if (nameConflict) {
        return res.status(400).json({
          success: false,
          message: 'Another coffee listing with this name already exists.'
        });
      }

      const newSlug = slugify(name);
      
      // Check if new slug conflicts with another document
      const conflict = await Coffee.findOne({ slug: newSlug, _id: { $ne: id } });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Another coffee listing is already using a similar name.'
        });
      }
      coffee.name = name.trim();
      coffee.slug = newSlug;
    }

    if (description) {
      coffee.description = description.trim();
    }

    if (imageUrl) {
      coffee.imageUrl = imageUrl.trim();
    }

    await coffee.save();

    return res.status(200).json({
      success: true,
      message: 'Coffee listing updated successfully.',
      data: coffee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete coffee listing (soft-delete)
 * @route   DELETE /api/coffees/:id
 * @access  Private/Admin
 */
const deleteCoffee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coffee = await Coffee.findById(id);
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee listing not found.'
      });
    }

    // Mark inactive instead of dropping records
    coffee.isActive = false;
    await coffee.save();

    return res.status(200).json({
      success: true,
      message: 'Coffee listing successfully deactivated.',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee
};
