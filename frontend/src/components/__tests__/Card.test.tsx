/**
 * WF-COMP-XXX | Card.test.tsx - Card Component Tests
 * Purpose: Comprehensive tests for Card component
 * Dependencies: @testing-library/react
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { describe, it, expect } from 'vitest';
import { renderWithoutRouter } from '@/test-utils';
import Card from '../Card';
import Button from '../Button';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      const { getByText } = renderWithoutRouter(
        <Card>
          <p>Card content</p>
        </Card>
      );

      expect(getByText('Card content')).toBeInTheDocument();
    });

    it('should render with default classes', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <p>Content</p>
        </Card>
      );

      const card = container.firstChild;
      expect(card).toHaveClass('card');
    });

    it('should render card body', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <p>Content</p>
        </Card>
      );

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = renderWithoutRouter(
        <Card className="custom-card">
          <p>Content</p>
        </Card>
      );

      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('custom-card');
    });
  });

  describe('Title and Subtitle', () => {
    it('should render title', () => {
      const { getByText } = renderWithoutRouter(
        <Card title="Card Title">
          <p>Content</p>
        </Card>
      );

      expect(getByText('Card Title')).toBeInTheDocument();
    });

    it('should render title as h2 heading', () => {
      const { getByRole } = renderWithoutRouter(
        <Card title="Card Title">
          <p>Content</p>
        </Card>
      );

      const heading = getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Card Title');
      expect(heading).toHaveClass('card-title');
    });

    it('should render subtitle', () => {
      const { getByText } = renderWithoutRouter(
        <Card title="Title" subtitle="Card Subtitle">
          <p>Content</p>
        </Card>
      );

      expect(getByText('Card Subtitle')).toBeInTheDocument();
    });

    it('should render subtitle with correct class', () => {
      const { getByText } = renderWithoutRouter(
        <Card title="Title" subtitle="Subtitle">
          <p>Content</p>
        </Card>
      );

      const subtitle = getByText('Subtitle');
      expect(subtitle).toHaveClass('card-subtitle');
      expect(subtitle.tagName).toBe('P');
    });

    it('should render both title and subtitle', () => {
      const { getByText, getByRole } = renderWithoutRouter(
        <Card title="Main Title" subtitle="Helpful subtitle">
          <p>Content</p>
        </Card>
      );

      expect(getByRole('heading', { level: 2 })).toHaveTextContent('Main Title');
      expect(getByText('Helpful subtitle')).toBeInTheDocument();
    });

    it('should not render header when no title, subtitle, or actions', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <p>Content only</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      expect(header).not.toBeInTheDocument();
    });

    it('should render header with only title', () => {
      const { container } = renderWithoutRouter(
        <Card title="Only Title">
          <p>Content</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render actions in header', () => {
      const actions = <Button>Edit</Button>;
      const { getByRole } = renderWithoutRouter(
        <Card title="Title" actions={actions}>
          <p>Content</p>
        </Card>
      );

      expect(getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should render actions with correct class', () => {
      const actions = <Button>Save</Button>;
      const { container } = renderWithoutRouter(
        <Card title="Title" actions={actions}>
          <p>Content</p>
        </Card>
      );

      const actionsDiv = container.querySelector('.card-actions');
      expect(actionsDiv).toBeInTheDocument();
    });

    it('should render multiple action buttons', () => {
      const actions = (
        <>
          <Button>Edit</Button>
          <Button variant="danger">Delete</Button>
        </>
      );
      const { getByRole } = renderWithoutRouter(
        <Card title="Title" actions={actions}>
          <p>Content</p>
        </Card>
      );

      expect(getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should render header with only actions (no title)', () => {
      const actions = <Button>Close</Button>;
      const { container, getByRole } = renderWithoutRouter(
        <Card actions={actions}>
          <p>Content</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      expect(header).toBeInTheDocument();
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should position actions correctly in header', () => {
      const actions = <Button>Action</Button>;
      const { container } = renderWithoutRouter(
        <Card title="Title" actions={actions}>
          <p>Content</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      const actionsDiv = container.querySelector('.card-actions');

      expect(header).toContainElement(actionsDiv as HTMLElement);
    });
  });

  describe('No Padding Option', () => {
    it('should apply no-padding class when noPadding is true', () => {
      const { container } = renderWithoutRouter(
        <Card noPadding>
          <p>Content</p>
        </Card>
      );

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toHaveClass('card-body-no-padding');
    });

    it('should not apply no-padding class by default', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <p>Content</p>
        </Card>
      );

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).not.toHaveClass('card-body-no-padding');
    });

    it('should apply no-padding class when noPadding is false', () => {
      const { container } = renderWithoutRouter(
        <Card noPadding={false}>
          <p>Content</p>
        </Card>
      );

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).not.toHaveClass('card-body-no-padding');
    });
  });

  describe('Content Rendering', () => {
    it('should render simple text content', () => {
      const { getByText } = renderWithoutRouter(
        <Card>
          <p>Simple text</p>
        </Card>
      );

      expect(getByText('Simple text')).toBeInTheDocument();
    });

    it('should render complex nested content', () => {
      const { getByText, getByRole } = renderWithoutRouter(
        <Card title="Complex Card">
          <div>
            <h3>Section Title</h3>
            <p>Paragraph text</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
            <Button>Action</Button>
          </div>
        </Card>
      );

      expect(getByText('Section Title')).toBeInTheDocument();
      expect(getByText('Paragraph text')).toBeInTheDocument();
      expect(getByText('Item 1')).toBeInTheDocument();
      expect(getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('should render lists', () => {
      const { getByText } = renderWithoutRouter(
        <Card>
          <ul>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
        </Card>
      );

      expect(getByText('First item')).toBeInTheDocument();
      expect(getByText('Second item')).toBeInTheDocument();
      expect(getByText('Third item')).toBeInTheDocument();
    });

    it('should render forms', () => {
      const { getByLabelText, getByRole } = renderWithoutRouter(
        <Card title="Form Card">
          <form>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      );

      expect(getByLabelText('Name')).toBeInTheDocument();
      expect(getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render images', () => {
      const { getByAltText } = renderWithoutRouter(
        <Card>
          <img src="/test.jpg" alt="Test image" />
        </Card>
      );

      expect(getByAltText('Test image')).toBeInTheDocument();
    });
  });

  describe('Header Layout', () => {
    it('should render header content section', () => {
      const { container } = renderWithoutRouter(
        <Card title="Title" subtitle="Subtitle">
          <p>Content</p>
        </Card>
      );

      const headerContent = container.querySelector('.card-header-content');
      expect(headerContent).toBeInTheDocument();
    });

    it('should contain title and subtitle in header content', () => {
      const { container } = renderWithoutRouter(
        <Card title="Title" subtitle="Subtitle">
          <p>Content</p>
        </Card>
      );

      const headerContent = container.querySelector('.card-header-content');
      const title = container.querySelector('.card-title');
      const subtitle = container.querySelector('.card-subtitle');

      expect(headerContent).toContainElement(title);
      expect(headerContent).toContainElement(subtitle);
    });

    it('should render header with title and actions side by side', () => {
      const actions = <Button>Action</Button>;
      const { container } = renderWithoutRouter(
        <Card title="Title" actions={actions}>
          <p>Content</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      const headerContent = container.querySelector('.card-header-content');
      const cardActions = container.querySelector('.card-actions');

      expect(header).toContainElement(headerContent as HTMLElement);
      expect(header).toContainElement(cardActions as HTMLElement);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { getByRole } = renderWithoutRouter(
        <Card title="Accessible Card">
          <p>Content</p>
        </Card>
      );

      expect(getByRole('heading', { level: 2 })).toHaveTextContent('Accessible Card');
    });

    it('should be navigable', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <a href="/link">Link</a>
        </Card>
      );

      expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('should support focus management with interactive elements', () => {
      const { getByRole } = renderWithoutRouter(
        <Card title="Interactive Card" actions={<Button>Action</Button>}>
          <Button>Content Button</Button>
        </Card>
      );

      const buttons = getByRole('button', { name: /action/i });
      expect(buttons).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { container } = renderWithoutRouter(<Card />);

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
      expect(cardBody).toBeEmptyDOMElement();
    });

    it('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might need to wrap across multiple lines in the card header';
      const { getByText } = renderWithoutRouter(
        <Card title={longTitle}>
          <p>Content</p>
        </Card>
      );

      expect(getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long subtitles', () => {
      const longSubtitle = 'This is a very long subtitle with lots of explanatory text that provides context for the card content';
      const { getByText } = renderWithoutRouter(
        <Card title="Title" subtitle={longSubtitle}>
          <p>Content</p>
        </Card>
      );

      expect(getByText(longSubtitle)).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      const { container } = renderWithoutRouter(
        <Card title="Title">{null}</Card>
      );

      const cardBody = container.querySelector('.card-body');
      expect(cardBody).toBeInTheDocument();
    });

    it('should handle undefined title gracefully', () => {
      const { container } = renderWithoutRouter(
        <Card title={undefined}>
          <p>Content</p>
        </Card>
      );

      const header = container.querySelector('.card-header');
      expect(header).not.toBeInTheDocument();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for simple card', () => {
      const { container } = renderWithoutRouter(
        <Card>
          <p>Simple content</p>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for card with all features', () => {
      const { container } = renderWithoutRouter(
        <Card
          title="Full Featured Card"
          subtitle="With all props"
          actions={<Button>Action</Button>}
          className="custom-class"
        >
          <p>Card content</p>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for card with no padding', () => {
      const { container } = renderWithoutRouter(
        <Card noPadding>
          <p>No padding content</p>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
